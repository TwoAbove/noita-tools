import util from "util";
import { REST, Routes, Client, GatewayIntentBits, TextChannel, Interaction } from "discord.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const errorChannelId = process.env.DISCORD_ERROR_CHANNEL_ID;

const commands = [
  {
    name: "noitool",
    description: "Ask Noitool for something",
  },
] as const;

const rest = new REST({ version: "10" }).setToken(token || "");

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId!), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (interaction.commandName === "noitool") {
    await interaction.reply("Pong!");
  }
});

if (errorChannelId) {
  async function sendErrorToDiscord(...args: any[]): Promise<void> {
    const errorChannel = (await client.channels.fetch(errorChannelId)) as TextChannel;
    if (errorChannel) {
      await errorChannel.send(
        `An error occurred:\n\`\`\`\n${util.inspect(args, false, null, false).substring(0, 1900)}\n\`\`\``,
      );
    }
  }

  const consoleError = console.error;
  console.error = (...args: any[]): void => {
    console.log(args);
    if (args.length) {
      sendErrorToDiscord(args);
    }
    return consoleError(...args);
  };

  // Catch all unhandled promise rejections and send them to the Discord channel
  process.on("unhandledRejection", async (reason: any, promise: Promise<any>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await sendErrorToDiscord(reason);
  });

  // Catch all uncaught exceptions and send them to the Discord channel
  process.on("uncaughtException", async (error: Error) => {
    console.error("Uncaught Exception:", error);
    await sendErrorToDiscord(error);
    process.exit(1);
  });
}

client.login(token);

export { client, rest };
