import "dotenv-flow/config";
import { logger } from "./logger.mjs";

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
  import("./discord.mjs").catch(e => {
    logger.error("Failed to start Discord integration", e);
  });
}

import "./server.mjs";
