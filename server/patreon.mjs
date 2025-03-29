import { Router } from "express";
import { schedule } from "node-cron";
import patreon from "patreon";

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

  async makeAuthorizedRequest(url, options) {
    let token = this.creatorAccessToken;
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
          const tokens = await this.refreshCreatorToken();
          token = tokens.access_token;
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
    console.error("Failed to fetch members:", error);
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
    console.error(e);
  }
};

updatePatrons();
schedule("* * * * *", updatePatrons);

router.get("/patrons", async (req, res) => {
  res.send(patronCache);
});

export default router;
