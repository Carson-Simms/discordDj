const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const commands = require("./utils/slash-commands");

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("Starting to refresh application (/) commands...");

    console.log(
      "Registering the following commands:",
      JSON.stringify(commands, null, 2)
    );

    const result = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("Discord API response:", JSON.stringify(result, null, 2));
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Failed to reload commands:", error);
  }
})();
