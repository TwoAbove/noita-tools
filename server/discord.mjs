import util from "util";
import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import { logger } from "./logger.mjs";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const errorChannelId = process.env.DISCORD_ERROR_CHANNEL_ID;

const commands = [
  {
    name: "noitool",
    description: "Ask Noitool for something",
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    logger.info("Started refreshing application commands");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    logger.info("Successfully reloaded application commands");
  } catch (error) {
    logger.error("Failed to refresh Discord application commands", error);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on("ready", async () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (interaction.commandName === "noitool") {
    await interaction.reply("Pong!");
  }
});

if (errorChannelId) {
  const chunk = (value, size) => {
    const chunks = [];
    for (let index = 0; index < value.length; index += size) {
      chunks.push(value.slice(index, index + size));
    }
    return chunks;
  };

  async function sendErrorToDiscord(...args) {
    const errorChannel = await client.channels.fetch(errorChannelId);
    if (errorChannel) {
      const message = util.inspect(args, false, null, false);
      for (const part of chunk(message, 1900)) {
        await errorChannel.send(`An error occurred:\n\`\`\`\n${part}\n\`\`\``);
      }
    }
  }

  process.on("unhandledRejection", async (reason, promise) => {
    logger.error("Unhandled rejection", { promise, reason });
    await sendErrorToDiscord(reason);
  });

  process.on("uncaughtException", async error => {
    logger.error("Uncaught exception", error);
    await sendErrorToDiscord(error);
    process.exit(1);
  });
}

client.login(token);

export { client, rest };
