import "dotenv-flow/config";

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
  import("./discord.mjs");
}

import "./server.mjs";
