require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { playYouTubeVideo } = require("./youtube/youtube-handler");

const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Message Functions

client.on("messageCreate", (message) => {
  if (message.content === "dong") {
    message.reply("beau you stupid fat loser");
  }
});

// Commands Functions

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "play") {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply(
        "You need to be in a voice channel to play music!"
      );
      return;
    }

    console.log("Received play command with query:", query);

    await interaction.deferReply();
    console.log("Reply deferred, attempting to play...");

    playYouTubeVideo(voiceChannel, query)
      .then(() => {
        console.log("Playback successful, editing reply...");
        interaction.editReply(`Playing: ${query}`);
      })
      .catch((err) => {
        console.error("Error during playback:", err);
        interaction.editReply("Failed to play the requested video.");
      });
  }
});

// Other Functions

client.login(process.env.DISCORD_BOT_TOKEN);
