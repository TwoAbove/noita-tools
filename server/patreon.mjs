import util from "util";
import { Router } from "express";
import { Types } from "mongoose";
import { schedule } from "node-cron";
import { randomUUID, createHmac } from "crypto";
import RateLimit from "express-rate-limit";
import patreon from "patreon";
import { genSessionCookie } from "./helpers.mjs";
import { User } from "./db.mjs";

const patreonOAuth = patreon.oauth;
const router = Router();

class TokenManager {
  constructor(clientId, clientSecret) {
    this.patreonOAuthClient = patreonOAuth(clientId, clientSecret);
    this.creatorAccessToken = process.env.PATREON_CREATORS_ACCESS_TOKEN;
    this.creatorRefreshToken = process.env.PATREON_CREATORS_REFRESH_TOKEN;
  }

  async refreshCreatorToken() {
    try {
      const tokens = await this.patreonOAuthClient.refreshToken(this.creatorRefreshToken);
      this.creatorAccessToken = tokens.access_token;
      this.creatorRefreshToken = tokens.refresh_token;

      console.log("Creator tokens refreshed successfully");
      return tokens;
    } catch (error) {
      console.error("Error refreshing creator tokens:", error.body || error);
      throw error;
    }
  }

  async refreshUserToken(user) {
    try {
      const tokens = await this.patreonOAuthClient.refreshToken(user.patreonData.refresh_token);
      user.patreonData = tokens;
      await user.save();
      return tokens;
    } catch (error) {
      console.error("Error refreshing user token:", error.body || error);
      throw error;
    }
  }

  async makeAuthorizedRequest(url, options, user = null) {
    let token = user ? user.patreonData.access_token : this.creatorAccessToken;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          if (user) {
            const tokens = await this.refreshUserToken(user);
            token = tokens.access_token;
          } else {
            const tokens = await this.refreshCreatorToken();
            token = tokens.access_token;
          }
          attempts++;
          continue;
        }

        return response;
      } catch (error) {
        console.error("API request failed:", error.body || error);
        throw error;
      }
    }

    throw new Error("Max retry attempts reached");
  }
}

const tokenManager = new TokenManager(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET);

schedule("0 0 */10 * *", () => tokenManager.refreshCreatorToken());

const nonHamisAmount = 1000 * 60 * 60 * 2; // 2 hours
const hamisAmount = 1000 * 60 * 60 * 10; // 10 hours
const hamis2Amount = 1000 * 60 * 60 * 20; // 20 hours
const hamis3Amount = 1000 * 60 * 60 * 40; // 40 hours
const hamis4Amount = 1000 * 60 * 60 * 800; // 80 hours

const getComputeAmountForTier = tierId => {
  let amount;

  switch (tierId) {
    case undefined: {
      amount = nonHamisAmount;
      break;
    }
    case "20133846": {
      // Free
      amount = +nonHamisAmount;
      break;
    }
    case "9702578": {
      // Hämis
      amount = +hamisAmount;
      break;
    }
    case "9702590": {
      // Hämis Hämis
      amount = +hamis2Amount;
      break;
    }
    case "9702596": {
      // Hämis Hämis Hämis
      amount = +hamis3Amount;
      break;
    }
    case "9704115": {
      // Hämis Hämis Hämis Hämis
      amount = +hamis4Amount;
      break;
    }
    default: {
      amount = +nonHamisAmount;
      console.error("Unknown tier", tierId, JSON.stringify(tierCache));
      break;
    }
  }

  return amount;
};

const getComputeAmountForPledgeAmount = pledgeAmount => {
  let amount;

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
      amount = (1000 * 60 * 60 * 10 * 400) / pledgeAmount;
      console.error("Unknown pledgeAmount", pledgeAmount, JSON.stringify(tierCache));
      if (isNaN(amount)) {
        amount = hamis4Amount;
      }
      break;
    }
  }

  return amount;
};

let patronMembersCache = [];
let patronCache = {};
let tierCache = {};

const membersQuery = async (cursor = null) => {
  const membersQueryParams = {
    include: ["currently_entitled_tiers", "user", "currently_entitled_tiers.campaign"].join(","),
    "fields[member]": [
      "full_name",
      "is_follower",
      "lifetime_support_cents",
      "currently_entitled_amount_cents",
      "patron_status",
    ].join(","),
    "fields[tier]": ["amount_cents", "title", "description"].join(","),
    "fields[campaign]": ["vanity"].join(","),
  };

  if (cursor) {
    membersQueryParams["page[cursor]"] = cursor;
  }

  const membersQueryURL = new URL("https://www.patreon.com/api/oauth2/v2/campaigns/10343002/members");
  Object.entries(membersQueryParams).forEach(([key, value]) => {
    membersQueryURL.searchParams.append(key, value);
  });

  try {
    const response = await tokenManager.makeAuthorizedRequest(membersQueryURL.href, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Noitool - Member Sync",
      },
    });

    const data = await response.json();
    if (data.errors) {
      console.error("Patreon API error, membersQuery:", data.errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch members:",
      typeof error === "object"
        ? error instanceof Error
          ? error.message
          : JSON.stringify(error, Object.getOwnPropertyNames(error))
        : error,
    );
    return null;
  }
};

const getPatreonPatronsData = async () => {
  if (!tokenManager.creatorAccessToken) {
    return { tierMembers: {}, tiers: {} };
  }

  let allMembers = [];
  let tiers = {};
  let nextCursor = null;
  let isFirstPage = true;

  do {
    const data = await membersQuery(nextCursor);

    if (!data) {
      console.error("Failed to fetch members page");
      break;
    }

    // Store tier data from first page only as it contains all tiers
    if (isFirstPage) {
      tiers = data.included
        .filter(i => i.type === "tier")
        .reduce((acc, tier) => {
          acc[tier.id] = tier;
          return acc;
        }, {});
      isFirstPage = false;
    }

    allMembers = allMembers.concat(data.data);
    nextCursor = data.meta.pagination.cursors?.next;
  } while (nextCursor);

  patronMembersCache = allMembers;

  const tierMembers = allMembers
    .filter(member => {
      // Include active patrons and those with free tier access
      const isActivePaid = member.attributes.patron_status === "active_patron";
      const hasTiers = member.relationships.currently_entitled_tiers.data.length > 0;
      const isDeclined = member.attributes.patron_status === "declined_patron";
      const isFormer = member.attributes.patron_status === "former_patron";

      return isActivePaid || (hasTiers && !isDeclined && !isFormer);
    })
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

  tierMembers.Donation = {
    tier: {
      id: "donation",
      type: "tier",
      attributes: {
        amount_cents: 0,
        title: "Donation",
        url: "",
        description: "One-time donations",
        created_at: new Date().toISOString(),
        edited_at: new Date().toISOString(),
        published: true,
        published_at: new Date().toISOString(),
        patron_count: 1,
        requires_shipping: false,
      },
    },
    members: ["BurritoSuicide"],
  };

  return { tierMembers, tiers };
};

const updatePatrons = async () => {
  try {
    const { tierMembers, tiers } = await getPatreonPatronsData();
    patronCache = tierMembers;
    tierCache = tiers;
  } catch (e) {
    console.error(e);
  }
};

updatePatrons();
schedule("* * * * *", updatePatrons);

const getPledgeAmount = patron =>
  patron?.attributes?.currently_entitled_amount_cents ||
  patron?.attributes?.pledge_amount_cents ||
  patron?.will_pay_amount_cents ||
  patron?.attributes?.will_pay_amount_cents;

router.post("/webhook", async (req, res) => {
  const logs = [];
  let patreonData = null;

  logs.push({ message: "Webhook received", event: req.headers["x-patreon-event"] });
  const headers = req.headers;
  const secret = headers["x-patreon-signature"];
  logs.push({ message: "Headers received" });
  patreonData = { headers };

  const hash = createHmac("md5", process.env.PATREON_WEBHOOK_SECRET).update(req.rawBody).digest("hex");
  if (hash !== secret) {
    logs.push({ message: "Webhook authentication failed" });
    logAtEnd(logs, patreonData);
    res.status(401).send(null);
    return;
  }

  logs.push({ message: "Webhook authenticated" });
  patreonData.body = req.body;

  const trigger = headers["x-patreon-event"];
  const { body } = req;

  switch (trigger) {
    case "members:pledge:create": {
      const patron = body.data;
      const patreonId = patron.relationships.user.data.id;
      const pledgeAmount = getPledgeAmount(patron);
      const amount = getComputeAmountForPledgeAmount(pledgeAmount);
      logs.push({
        message: "New pledge",
        patreonId: patreonId,
        pledgeAmount: pledgeAmount,
        computeAmount: amount,
      });

      let user = await User.findOne({ patreonId: { $eq: patreonId } });
      if (!user) {
        user = await User.create({
          _id: new Types.ObjectId(),
          patreonId,
          sessionToken: randomUUID(),
          compute: {
            lastReset: new Date(),
            resetDay: new Date().getDate(),
            patreonComputeLeft: amount,
            providedComputeLeft: 0,
          },
        });
        logs.push({ message: "New user created for pledge", userId: user.patreonId });
      } else {
        user.compute.patreonComputeLeft = amount;
        logs.push({ message: "Existing user updated for pledge", userId: user.patreonId });
      }
      await user.save();
      break;
    }
    case "members:pledge:update": {
      const patron = body.data;
      const patreonId = patron.relationships.user.data.id;
      const pledgeAmount = getPledgeAmount(patron);
      const amount = getComputeAmountForPledgeAmount(pledgeAmount);
      logs.push({
        message: "Pledge update",
        patreonId: patreonId,
        newPledgeAmount: pledgeAmount,
        newComputeAmount: amount,
      });
      const user = await User.findOne({ patreonId: { $eq: patreonId } });
      if (!user) {
        logs.push({ message: "User not found for pledge update", patreonId: patreonId });
        break;
      }
      user.compute.patreonComputeLeft = amount;
      await user.save();
      logs.push({ message: "User updated for pledge update", userId: user.id });
      break;
    }
    default: {
      console.error("Unhandled webhook event", trigger);
      logs.push({ message: "Unhandled webhook event", event: trigger });
      break;
    }
  }

  logs.push({ message: "Webhook processing complete" });
  logAtEnd(logs, patreonData);
  res.status(200).send(null);
});

const updatePatreonCompute = async () => {
  const logs = [];
  let patreonData = null;

  try {
    logs.push({ message: "Fetching patron members" });
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const users = await User.find({
      "compute.lastReset": {
        $lt: lastMonth.toISOString(),
      },
    });
    logs.push({ message: `Found ${users.length} users`, userIds: users.map(u => u.id) });

    for (const user of users) {
      const patron = patronMembersCache.find(m => m.relationships.user.data.id === user.patreonId);
      logs.push({ message: "Patron data", patron });

      let tierId;
      if (patron) {
        const tierIds = patron.relationships.currently_entitled_tiers.data.map(t => t.id);
        tierId = tierIds[0];
      } else {
        logs.push({ message: "User not found in patron members", userId: user.id });
      }

      logs.push({ message: "Tier ID", tierId });

      const amount = getComputeAmountForTier(tierId);
      logs.push({ message: "Compute amount calculated", userId: user.id, tierId, amount });

      user.compute.lastReset = new Date().toISOString();
      user.compute.patreonComputeLeft = amount;
      await user.save();
      logs.push({ message: "User updated", userId: user.id });
    }
  } catch (e) {
    logs.push({ message: "Error in updatePatreonCompute", error: e.message });
    console.error("Error in updatePatreonCompute", e);
  }

  logAtEnd(logs, patreonData);
};

// schedule("* * * * *", () => updatePatreonCompute());

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

  try {
    const response = await tokenManager.makeAuthorizedRequest(
      identityQuery.href,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      { patreonData: { access_token: token } },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching identity:", error);
    throw error;
  }
};

router.get(
  "/redirect",
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
  }),
  async (req, res) => {
    const logs = [];
    let patreonData = null;

    logs.push({ message: "Redirect route accessed", queryParams: req.query });
    const { code, state } = req.query;

    if (state !== req.cookies.noitoolSessionToken) {
      logs.push({
        message: "Redirect state mismatch",
        cookie: req.cookies.noitoolSessionToken,
        state: state,
      });
      logAtEnd(logs, patreonData);
      res.redirect("/");
      return;
    }

    try {
      const tokens = await tokenManager.patreonOAuthClient.getTokens(code, process.env.PATREON_REDIRECT_URL);
      logs.push({ message: "Tokens obtained" });
      patreonData = { tokens };

      const data = await getIdentity(tokens.access_token);
      logs.push({ message: "Identity data retrieved" });
      patreonData.identity = data;

      const { id } = data.data;

      let user = await User.findOne({ patreonId: id });
      logs.push({
        message: user ? "User found" : "User not found",
        userId: user ? user._id : null,
      });

      if (!user) {
        user = await User.create({
          _id: new Types.ObjectId(),
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
        logs.push({ message: "New user created", userId: user._id });

        let amount = +nonHamisAmount;

        const patron = patronMembersCache.find(m => m.relationships.user.data.id === id);
        logs.push({ message: "Patron check", patron });
        if (patron) {
          const tierIds = patron.relationships.currently_entitled_tiers.data.map(t => t.id);
          const tierId = tierIds[0];
          amount = getComputeAmountForTier(tierId);
          logs.push({ message: "Patron found", tierId: tierId, amount });
        }
        user.compute.patreonComputeLeft = amount;

        await user.save();
        logs.push({ message: "User saved with compute amount", amount });
      } else {
        user.patreonData = tokens;
        res.cookie("noitoolSessionToken", user.sessionToken, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
        logs.push({ message: "Existing user updated. Session token set." });

        await user.save();
      }
    } catch (e) {
      logs.push({ message: "Error in redirect route", error: e.message });
      console.error("Error in redirect route", e);
      logAtEnd(logs, patreonData);
      return res.redirect("/");
    }

    logs.push({ message: "Redirect successful. Redirecting to /" });
    logAtEnd(logs, patreonData);
    res.redirect("/");
  },
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
  try {
    const identityURL = new URL("https://www.patreon.com/api/oauth2/v2/identity");
    identityURL.searchParams.append("fields[user]", ["full_name", "url", "image_url"].join(","));

    const response = await tokenManager.makeAuthorizedRequest(
      identityURL.href,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      req.user,
    );

    if (!response.ok) {
      console.error(`Patreon API error: ${response.status} ${response.statusText}`);
      if (response.status === 503) {
        return res.status(503).json({ error: "Patreon service temporarily unavailable" });
      }
      return res.status(response.status).json({ error: "Error fetching Patreon data" });
    }

    const patreonUser = await response.json();
    if (patreonUser.errors) {
      console.error("Patreon API returned errors:", patreonUser.errors);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.patreonUser = patreonUser.data;
    next();
  } catch (error) {
    console.error("Error in loadPatreonClient:", error);
    if (error.message === "Max retry attempts reached") {
      res.clearCookie("noitoolSessionToken");
      return res.status(401).json({
        error: "Patreon authentication expired. Please re-link your account.",
        action: "LOGOUT",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
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
    max: 600,
  }),
  authenticated,
  loadUser,
  loadPatreonClient,
  async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=60");
    res.send(gatherMeData(req.user, req.patreonUser));
  },
);

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
  },
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
    await user.save();
  },
);

export default router;
