import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { logger } from "./logger.mjs";

const TOKEN_URL = "https://www.patreon.com/api/oauth2/token";

export const fileTokenStore = file => ({
  async load() {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  },
  async save(record) {
    await mkdir(dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await writeFile(tmp, JSON.stringify(record), { mode: 0o600 });
    await rename(tmp, file);
  },
});

export const memoryTokenStore = () => {
  let record = null;
  return {
    async load() {
      return record;
    },
    async save(next) {
      record = next;
    },
  };
};

const seedId = seed => createHash("sha256").update(seed.refreshToken).digest("hex");

export class TokenManager {
  constructor({ clientId, clientSecret, store, seed, fetchImpl = globalThis.fetch }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.store = store;
    this.seed = seed;
    this.fetchImpl = fetchImpl;
    this.record = null;
    this.refreshing = null;
  }

  async init() {
    const stored = await this.store.load();
    const hasSeed = Boolean(this.seed.accessToken && this.seed.refreshToken);

    if (stored && (!hasSeed || stored.seedId === seedId(this.seed))) {
      this.record = stored;
      logger.info("Loaded Patreon creator tokens from store");
      return;
    }
    if (!hasSeed) return;

    this.record = {
      seedId: seedId(this.seed),
      accessToken: this.seed.accessToken,
      refreshToken: this.seed.refreshToken,
    };
    await this.store.save(this.record);
    logger.info("Seeded Patreon creator token store from env");
  }

  get hasTokens() {
    return this.record !== null;
  }

  refreshCreatorToken() {
    this.refreshing ??= this.#refresh().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  async #refresh() {
    logger.info("Refreshing Patreon creator tokens");
    const response = await this.fetchImpl(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.record.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });
    if (!response.ok) {
      throw new Error(`Patreon token refresh failed: HTTP ${response.status} ${await response.text()}`);
    }
    const body = await response.json();
    if (!body.access_token || !body.refresh_token) {
      throw new Error("Patreon token refresh response is missing tokens");
    }

    this.record = { ...this.record, accessToken: body.access_token, refreshToken: body.refresh_token };
    await this.store.save(this.record);
    logger.info("Patreon creator tokens refreshed and stored");
  }

  async makeAuthorizedRequest(url, options) {
    if (!this.record) {
      throw new Error("No Patreon creator tokens available");
    }

    const maxAttempts = 3;
    for (let attempt = 1; ; attempt++) {
      try {
        const response = await this.fetchImpl(url, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${this.record.accessToken}` },
        });

        if (response.status === 401) {
          logger.warn("Patreon returned 401, refreshing creator tokens");
          await this.refreshCreatorToken();
          if (attempt >= maxAttempts) throw new Error("Patreon kept returning 401 after token refresh");
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (attempt >= maxAttempts) {
          logger.error(`Max retry attempts (${maxAttempts}) reached for ${url}`, error);
          throw error;
        }
        logger.warn(`Request attempt ${attempt} failed, retrying`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}
