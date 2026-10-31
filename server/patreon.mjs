import { Router } from "express";
import { schedule } from "node-cron";
import { logger } from "./logger.mjs";
import { TokenManager, fileTokenStore, memoryTokenStore } from "./patreonTokens.mjs";

const router = Router();

const requiredEnvVars = [
  "PATREON_CLIENT_ID",
  "PATREON_CLIENT_SECRET",
  "PATREON_CREATORS_ACCESS_TOKEN",
  "PATREON_CREATORS_REFRESH_TOKEN",
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.warn("Patreon OAuth configuration incomplete. Missing environment variables", missingEnvVars);
  logger.warn("Patreon integration will be disabled until these variables are set");
}

const tokenFile = process.env.PATREON_TOKEN_FILE;
if (!tokenFile) {
  logger.warn("PATREON_TOKEN_FILE is not set; refreshed Patreon tokens will be lost on restart");
}

const tokenManager = new TokenManager({
  clientId: process.env.PATREON_CLIENT_ID,
  clientSecret: process.env.PATREON_CLIENT_SECRET,
  store: tokenFile ? fileTokenStore(tokenFile) : memoryTokenStore(),
  seed: {
    accessToken: process.env.PATREON_CREATORS_ACCESS_TOKEN,
    refreshToken: process.env.PATREON_CREATORS_REFRESH_TOKEN,
  },
});

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
      logger.error("Patreon API error, membersQuery", {
        errors: data.errors,
        url: membersQueryURL.href,
        status: response.status,
        response: data,
      });
      return null;
    }

    return data;
  } catch (error) {
    logger.error("Failed to fetch members", {
      error: error.message,
      url: membersQueryURL.href,
      stack: error.stack,
    });
    return null;
  }
};

const getPatreonPatronsData = async () => {
  if (!tokenManager.hasTokens) {
    return { tierMembers: {}, tiers: {} };
  }

  let allMembers = [];
  let tiers = {};
  let nextCursor = null;
  let isFirstPage = true;

  do {
    const data = await membersQuery(nextCursor);
    if (!data) {
      logger.error("Failed to fetch members page");
      break;
    }

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

  const tierMembers = allMembers
    .filter(member => {
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
    logger.error("Failed to update patrons", e);
  }
};

tokenManager
  .init()
  .then(() => {
    updatePatrons();
    schedule("* * * * *", updatePatrons);
  })
  .catch(error => logger.error("Failed to initialize Patreon creator tokens", error));

router.get("/patrons", async (req, res) => {
  res.send(patronCache);
});

export default router;
