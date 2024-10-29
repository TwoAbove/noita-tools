import "dotenv-flow/config";

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
  import("./discord.mjs").catch(e => {
    console.error(e);
  });
}

import "./server.mjs";
