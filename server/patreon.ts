import util from "util";
import { Router, Request, Response } from "express";
import { schedule } from "node-cron";
import { randomUUID, createHmac } from "crypto";
import RateLimit from "express-rate-limit";
import patreon from "patreon";
import { genSessionCookie } from "./helpers";

const patreonOAuth = patreon.oauth;
const router = Router();

interface PatreonTokens {
  access_token: string;
  refresh_token: string;
}

interface PatreonTier {
  id: string;
  type: string;
  attributes: {
    amount_cents: number;
    title: string;
    url?: string;
    description: string;
    created_at: string;
    edited_at: string;
    published: boolean;
    published_at: string;
    patron_count: number;
    requires_shipping: boolean;
  };
}

interface PatreonMember {
  id: string;
  type: string;
  attributes: {
    full_name: string;
    patron_status: string;
    lifetime_support_cents: number;
    currently_entitled_amount_cents: number;
    is_follower: boolean;
  };
  relationships: {
    currently_entitled_tiers: {
      data: Array<{ id: string; type: string }>;
    };
  };
}

interface TierMemberGroup {
  tier: PatreonTier;
  members: string[];
}

interface TierMembersCache {
  [tierId: string]: TierMemberGroup;
}

interface TierCache {
  [tierId: string]: PatreonTier;
}

class TokenManager {
  private patreonOAuthClient: any;
  private creatorAccessToken: string;
  private creatorRefreshToken: string;

  constructor(clientId: string, clientSecret: string) {
    this.patreonOAuthClient = patreonOAuth(clientId, clientSecret);
    this.creatorAccessToken = process.env.PATREON_CREATORS_ACCESS_TOKEN || "";
    this.creatorRefreshToken = process.env.PATREON_CREATORS_REFRESH_TOKEN || "";
  }

  async refreshCreatorToken(): Promise<PatreonTokens> {
    try {
      const tokens = await this.patreonOAuthClient.refreshToken(this.creatorRefreshToken);
      this.creatorAccessToken = tokens.access_token;
      this.creatorRefreshToken = tokens.refresh_token;
      console.log("Creator tokens refreshed successfully");
      return tokens;
    } catch (error) {
      console.error("Error refreshing creator tokens:", error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async makeAuthorizedRequest(url: string, options: RequestInit) {
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
        console.error("API request failed:", error instanceof Error ? error.message : error);
        throw error;
      }
    }
    throw new Error("Max retry attempts reached");
  }
}

const tokenManager = new TokenManager(process.env.PATREON_CLIENT_ID || "", process.env.PATREON_CLIENT_SECRET || "");

schedule("0 0 */10 * *", () => tokenManager.refreshCreatorToken());

let patronMembersCache: PatreonMember[] = [];
let patronCache: TierMembersCache = {};
let tierCache: TierCache = {};

const membersQuery = async (cursor: string | null = null) => {
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
    if ("errors" in data) {
      console.error("Patreon API error, membersQuery:", data.errors);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch members:", error instanceof Error ? error.message : JSON.stringify(error));
    return null;
  }
};

const getPatreonPatronsData = async () => {
  if (!tokenManager.creatorAccessToken) {
    return { tierMembers: {}, tiers: {} };
  }

  let allMembers: PatreonMember[] = [];
  let tiers: TierCache = {};
  let nextCursor: string | null = null;
  let isFirstPage = true;

  do {
    const data = await membersQuery(nextCursor);
    if (!data) {
      console.error("Failed to fetch members page");
      break;
    }

    if (isFirstPage) {
      tiers = data.included
        .filter((i: any) => i.type === "tier")
        .reduce((acc: TierCache, tier: PatreonTier) => {
          acc[tier.id] = tier;
          return acc;
        }, {});
      isFirstPage = false;
    }

    allMembers = allMembers.concat(data.data);
    nextCursor = data.meta.pagination.cursors?.next || null;
  } while (nextCursor);

  patronMembersCache = allMembers;

  const tierMembers = allMembers
    .filter(member => {
      const isActivePaid = member.attributes.patron_status === "active_patron";
      const hasTiers = member.relationships.currently_entitled_tiers.data.length > 0;
      const isDeclined = member.attributes.patron_status === "declined_patron";
      const isFormer = member.attributes.patron_status === "former_patron";
      return isActivePaid || (hasTiers && !isDeclined && !isFormer);
    })
    .sort((a, b) => b.attributes.lifetime_support_cents - a.attributes.lifetime_support_cents)
    .reduce((acc: TierMembersCache, member) => {
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

router.get("/patrons", async (req: Request, res: Response) => {
  res.send(patronCache);
});

function logAtEnd(logs: any, patreonData: any) {
  console.log({
    timeStamp: new Date().toISOString(),
    logs,
    patreonData: patreonData?.body ? { ...patreonData, body: "BODY REMOVED" } : patreonData,
  });
}

export default router;
