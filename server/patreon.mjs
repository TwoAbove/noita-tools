import { Router } from "express";
import { schedule } from "node-cron";
import patreon from "patreon";

const patreonOAuth = patreon.oauth;
const router = Router();

class TokenManager {
  constructor(clientId, clientSecret) {
    if (!clientId || !clientSecret) {
      throw new Error("Patreon OAuth client ID and secret are required");
    }

    try {
      this.patreonOAuthClient = patreonOAuth(clientId, clientSecret);
      this.creatorAccessToken = process.env.PATREON_CREATORS_ACCESS_TOKEN;
      this.creatorRefreshToken = process.env.PATREON_CREATORS_REFRESH_TOKEN;

      console.log("TokenManager initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Patreon OAuth client:", error);
      throw error;
    }
  }

  async refreshCreatorToken() {
    if (!this.creatorRefreshToken) {
      throw new Error("PATREON_CREATORS_REFRESH_TOKEN is not configured");
    }

    try {
      console.log("Attempting to refresh Patreon creator tokens");
      const tokens = await this.patreonOAuthClient.refreshToken(this.creatorRefreshToken);

      if (!tokens || !tokens.access_token || !tokens.refresh_token) {
        throw new Error("Invalid token response from Patreon");
      }

      this.creatorAccessToken = tokens.access_token;
      this.creatorRefreshToken = tokens.refresh_token;
      console.log("Creator tokens refreshed successfully");
      return tokens;
    } catch (error) {
      console.error("Error refreshing creator tokens:", {
        error: error.body || error,
        status: error.status,
        message: error.message,
      });
      throw error;
    }
  }

  async makeAuthorizedRequest(url, options) {
    if (!this.creatorAccessToken) {
      console.warn("No creator access token available, skipping request");
      throw new Error("No valid access token available");
    }

    let token = this.creatorAccessToken;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        console.log(`Making authorized request to ${url}, attempt ${attempts + 1}`);
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.log("Received 401, attempting token refresh...");
          try {
            const tokens = await this.refreshCreatorToken();
            token = tokens.access_token;
            attempts++;
            continue;
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            throw refreshError;
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error(`Max retry attempts (${maxAttempts}) reached for ${url}:`, error);
          throw error;
        }

        console.warn(`Request attempt ${attempts} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
      }
    }

    throw new Error("Max retry attempts reached");
  }
}

const tokenManager = new TokenManager(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET);

// Check if required environment variables are set
const requiredEnvVars = [
  "PATREON_CLIENT_ID",
  "PATREON_CLIENT_SECRET",
  "PATREON_CREATORS_ACCESS_TOKEN",
  "PATREON_CREATORS_REFRESH_TOKEN",
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn("Patreon OAuth configuration incomplete. Missing environment variables:", missingEnvVars);
  console.warn("Patreon integration will be disabled until these variables are set.");
} else {
  console.log("Patreon OAuth configuration complete. Token manager initialized successfully.");
}

schedule("0 0 */10 * *", () => {
  if (tokenManager.creatorAccessToken) {
    tokenManager.refreshCreatorToken().catch(error => {
      console.error("Scheduled token refresh failed:", error);
    });
  }
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
      console.error("Patreon API error, membersQuery:", {
        errors: data.errors,
        url: membersQueryURL.href,
        status: response.status,
        response: data,
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch members:", {
      error: error.message,
      url: membersQueryURL.href,
      stack: error.stack,
    });
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
