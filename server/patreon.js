const { Router } = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { randomUUID, createHmac } = require("crypto");

const RateLimit = require("express-rate-limit");

const { User } = require("./db");
const { genSessionCookie } = require("./helpers");

const patreon = require("patreon");
const patreonOAuth = patreon.oauth;

const patreonOAuthClient = patreonOAuth(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET);

const router = Router();

const membersQuery = () => {
  const membersQueryParams = {
    include: ["currently_entitled_tiers", "user"].join(","),
    "fields[member]": [
      "full_name",
      "is_follower",
      "lifetime_support_cents",
      "currently_entitled_amount_cents",
      "patron_status",
    ].join(","),
    "fields[tier]": ["amount_cents", "published", "title", "url"].join(","),
  };

  const membersQuery = new URL("https://www.patreon.com/api/oauth2/v2/campaigns/10343002/members");

  Object.entries(membersQueryParams).forEach(([key, value]) => {
    membersQuery.searchParams.append(key, value);
  });

  return fetch(membersQuery.href, {
    headers: {
      Authorization: `Bearer ${process.env.PATREON_CREATORS_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  }).then(r => r.json());
};

let patronMembersCache = {};

const getPatreonPatronsData = async () => {
  if (!process.env.PATREON_CREATORS_ACCESS_TOKEN) {
    return {};
  }

  // TODO: Handler pagination
  const data = await membersQuery();

  const tiers = data.included
    .filter(i => i.type === "tier" && i.attributes.published)
    .reduce((acc, tier) => {
      acc[tier.id] = tier;
      return acc;
    }, {});

  const members = data.data.filter(d => d.type === "member");
  patronMembersCache = members;

  const tierMembers = members
    .sort((a, b) => b.attributes.lifetime_support_cents - a.attributes.lifetime_support_cents)
    .reduce((acc, member) => {
      const tierIds = member.relationships.currently_entitled_tiers.data.map(t => t.id);
      tierIds.forEach(tierId => {
        if (!acc[tierId]) {
          acc[tierId] = {
            tier: tiers[tierId],
            members: [],
          };
        }
        acc[tierId].members.push(member.attributes.full_name);
      });
      return acc;
    }, {});

  return tierMembers;
};

let patronCache = {};

const updatePatrons = async () => {
  patronCache = await getPatreonPatronsData();
};

updatePatrons();
cron.schedule("* * * * *", updatePatrons); // every minute

router.get("/patrons", async (req, res) => {
  res.send(patronCache);
});

const getIdentity = async token => {
  const identityQueryParams = {
    "fields[user]": ["full_name", "url", "image_url"],
  };

  const identityQuery = new URL("https://www.patreon.com/api/oauth2/v2/identity");

  Object.entries(identityQueryParams).forEach(([key, value]) => {
    identityQuery.searchParams.append(key, value);
  });

  return fetch(identityQuery.href, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(r => r.json());
};

const hamisAmount = 1000 * 60 * 60 * 20; // 20 hours
const hamis2Amount = 1000 * 60 * 60 * 40; // 40 hours
const hamis3Amount = 1000 * 60 * 60 * 80; // 80 hours
const hamis4Amount = 1000 * 60 * 60 * 160; // 160 hours

const getComputeAmountForTier = tierId => {
  let amount = 1000 * 60 * 60 * 5; // 5 hours

  switch (tierId) {
    case "9702578": {
      // Hämis
      amount = hamisAmount;

      break;
    }
    case "9702590": {
      // Hämis Hämis
      amount = hamis2Amount;
      break;
    }
    case "9702596": {
      // Hämis Hämis Hämis
      amount = hamis3Amount;
      break;
    }
    case "9704115": {
      // Hämis Hämis Hämis Hämis
      amount = hamis4Amount;
      break;
    }
    default: {
      amount = 1000 * 60 * 60 * 5;
      console.error("Unknown tier", tierId);
      break;
    }
  }

  return amount;
};

const getComputeAmountForPledgeAmount = pledgeAmount => {
  let amount = 1000 * 60 * 60 * 5; // 5 hours

  switch (pledgeAmount) {
    case 400: {
      // Hämis
      amount = hamisAmount;

      break;
    }
    case 800: {
      // Hämis Hämis
      amount = hamis2Amount;
      break;
    }
    case 1600: {
      // Hämis Hämis Hämis
      amount = hamis3Amount;
      break;
    }
    case 3200: {
      // Hämis Hämis Hämis Hämis
      amount = hamis4Amount;
      break;
    }
    default: {
      amount = (1000 * 60 * 60 * 20 * 400) / pledgeAmount;
      console.error("Unknown pledgeAmount", pledgeAmount);
      if (isNaN(amount)) {
        amount = hamis4Amount;
      }
      break;
    }
  }

  return amount;
};

router.get(
  "/redirect",
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
  }),
  async (req, res) => {
    // Login flow
    const { code, state } = req.query;

    if (state !== req.cookies.noitoolSessionToken) {
      res.redirect("/");
      return;
    }

    try {
      const tokens = await patreonOAuthClient.getTokens(code, process.env.PATREON_REDIRECT_URL);

      const data = await getIdentity(tokens.access_token);

      const { id } = data.data;

      let user = await User.findOne({ patreonId: id });

      if (!user) {
        user = await User.create({
          _id: new mongoose.Types.ObjectId(),

          patreonData: tokens,

          patreonId: id,
          sessionToken: req.cookies.noitoolSessionToken,
          compute: {
            lastReset: new Date(),
            resetDay: new Date().getDate(),
            patreonComputeLeft: 0,
            providedComputeLeft: 0,
          },
        });

        // handle new user

        let amount = 1000 * 60 * 60 * 5; // 5 hours

        // Check if user is a patron
        const patron = patronMembersCache.find(m => m.relationships.user.data.id === id);
        if (patron) {
          const tierIds = patron.relationships.currently_entitled_tiers.data.map(t => t.id);
          const tierId = tierIds[0];
          amount = getComputeAmountForTier(tierId);
        }
        user.compute.patreonComputeLeft = amount;

        await user.save();
      } else {
        user.patreonData = tokens;
        res.cookie("noitoolSessionToken", user.sessionToken, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          sameSite: "lax",
        });

        await user.save();
      }
    } catch (e) {
      console.error(e);
      return res.redirect("/");
    }

    res.redirect("/");
  }
);

const authenticated = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.noitoolSessionToken) {
    res.status(401).send(null);
    return;
  }

  next();
};

const loadUser = async (req, res, next) => {
  const cookies = req.cookies;

  const user = await User.findOne({
    sessionToken: cookies.noitoolSessionToken,
  });

  if (!user) {
    res.status(401).send(null);
    return;
  }

  req.user = user;
  next();
};

const loadPatreonClient = async (req, res, next) => {
  const patreonUser = await getIdentity(req.user.patreonData.access_token);
  if (patreonUser.errors) {
    res.status(401).send(null);
    return;
  }

  req.patreonUser = patreonUser.data;
  next();
};

const gatherMeData = (user, patreonUser) => {
  const userId = patreonUser.id;
  const userName = patreonUser.attributes.full_name;
  const userUrl = patreonUser.attributes.url;
  const userImageUrl = patreonUser.attributes.image_url;

  let data = {
    patreonId: userId,
    noitoolId: user.id,
    userName,
    url: userUrl,
    avatar: userImageUrl,

    resetDay: user.compute.resetDay,
    patreonComputeLeft: user.compute.patreonComputeLeft,
    providedComputeLeft: user.compute.providedComputeLeft,
    computeLeft: user.compute.patreonComputeLeft + user.compute.providedComputeLeft,
  };

  const patronData = patronMembersCache.find(p => p.relationships.user.data.id === userId && p.type === "member");

  if (!patronData) {
    data.activePatron = false;
  }
  if (patronData) {
    data.activePatron = patronData.attributes.patron_status === "active_patron";
  }

  return data;
};

router.get(
  "/me",
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 40,
  }),
  authenticated,
  loadUser,
  loadPatreonClient,
  async (req, res) => {
    res.send(gatherMeData(req.user, req.patreonUser));
  }
);

// router.get('/me/db/:collection', authenticated, loadUser, async (req, res) => {
// 	const user = req.user;
// 	const state = user.noitoolState;

// 	const collection = state[req.params.collection];

// 	if (!collection) {
// 		res.status(404).send(null);
// 		return;
// 	}

// 	res.send(Buffer.from(collection.data));
// });

// const m = multer();
// router.post(
// 	'/me/db/:collection',
// 	m.any(),
// 	authenticated,
// 	loadUser,
// 	async (req, res) => {
// 		const user = req.user;

// 		const collection = req.params.collection;
// 		const data = req.files[0].buffer.toString('base64');

// 		const hash = createHash('sha256')
// 			.update(data)
// 			.digest('hex');

// 		user.noitoolState[collection] = {
// 			hash,
// 			data,
// 			updateAt: Date.now()
// 		};

// 		await user.save();

// 		res.send('ok');
// 	}
// );

// router.get(
// 	'/me/db/:collection/check',
// 	authenticated,
// 	loadUser,
// 	async (req, res) => {
// 		const user = req.user;

// 		const hash = req.query.hash;

// 		let key = '';
// 		switch (req.params.collection) {
// 			case 'configItems':
// 				key = 'configItems';
// 				break;
// 			default:
// 		}

// 		if (!key) {
// 			res.status(404).send({});
// 			return;
// 		}

// 		const collection = user.noitoolState[key];

// 		let status = 'not_exists';

// 		if (collection) {
// 			status = 'exists';
// 		}

// 		res.send({
// 			status,
// 			same: collection ? collection.hash === hash : null,
// 			updatedAt: new Date()
// 		});
// 	}
// );

router.post(
  "/logout",
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
  }),
  authenticated,
  async (req, res) => {
    res.clearCookie("noitoolSessionToken");
    genSessionCookie(res);

    res.status(200).send(null);
  }
);

router.post(
  "/logout_all",
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
  }),
  authenticated,
  loadUser,
  async (req, res) => {
    res.clearCookie("noitoolSessionToken");
    genSessionCookie(res);
    res.status(200).send(null);
    const user = req.user;
    user.sessionToken = randomUUID();
  }
);

// handle patreon webhook
router.post("/webhook", async (req, res) => {
  const headers = req.headers;
  const secret = headers["x-patreon-signature"];
  console.log(headers);
  const hash = createHmac("md5", process.env.PATREON_WEBHOOK_SECRET).update(req.rawBody).digest("hex");
  if (hash !== secret) {
    res.status(401).send(null);
    return;
  }

  console.log("Patreon webhook", headers["x-patreon-event"], req.body);

  const trigger = headers["x-patreon-event"];
  const { body } = req;

  switch (trigger) {
    case "members:pledge:create": {
      const patron = body.data;
      const patreonId = patron.relationships.user.data.id;
      const pledgeAmount =
        patron?.attributes?.currently_entitled_amount_cents ||
        patron?.attributes?.pledge_amount_cents ||
        patron?.will_pay_amount_cents ||
        patreon?.attributes?.will_pay_amount_cents;
      const amount = getComputeAmountForPledgeAmount(pledgeAmount);

      let user = await User.findOne({ patreonId });
      if (!user) {
        user = await User.create({
          _id: new mongoose.Types.ObjectId(),

          patreonId,

          sessionToken: randomUUID(),

          compute: {
            lastReset: new Date(),
            resetDay: new Date().getDate(),
            patreonComputeLeft: amount,
            providedComputeLeft: 0,
          },
        });
      } else {
        user.compute.patreonComputeLeft = amount;
      }
      await user.save();
      break;
    }
    case "members:pledge:update": {
      const patron = body.data;
      const patreonId = patron.relationships.user.data.id;
      const pledgeAmount = patron.attributes.pledge_amount_cents;
      const amount = getComputeAmountForPledgeAmount(pledgeAmount);
      const user = await User.findOne({ patreonId });
      if (!user) {
        // This should never happen
        console.error("User not found", patreonId);
        break;
      }
      user.compute.patreonComputeLeft = amount;
      await user.save();
      break;
    }
    default: {
      break;
    }
  }

  res.status(200).send(null);
});

const updatePatreonCompute = async () => {
  // all users with last update more than 1 month ago
  const logs = [];
  try {
    logs.push("Fetching patron members");
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const users = await User.find({
      "compute.lastReset": {
        $lte: lastMonth,
      },
    });
    logs.push(`Found ${users.length} users: ${users.map(u => u.id)}`);
    for (const user of users) {
      const patron = patronMembersCache.find(m => m.relationships.user.data.id === user.patreonId);
      let tierId;
      if (patron) {
        const tierIds = patron.relationships.currently_entitled_tiers.data.map(t => t.id);
        tierId = tierIds[0];
      }
      const amount = getComputeAmountForTier(tierId);
      logs.push(`User ${user.id} tierId ${tierId} amount ${amount}`);
      user.compute.lastReset = Date.now();
      user.compute.patreonComputeLeft = amount;
      await user.save();
    }
  } catch (e) {
    logs.push(e);
  }
  console.log(logs.join("\n"));
};
cron.schedule("* * * * *", () => updatePatreonCompute());

module.exports = router;
