require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { playYouTubeVideo } = require("./youtube/youtube-handler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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

client.on("messageCreate", (message) => {
  if (message.author.id === 212637413548228609) {
    message.reply("I hate this dumb beau guy");
  }
});

client.on("messageCreate", (message) => {
  if (message.author.id === 330884354005925889) {
    message.reply("I hate this dumb nickkger guy");
  }
});

// Commands Functions

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "play") {
    const query = options.getString("query");
    if (!interaction.member.voice.channel) {
      await interaction.reply(
        "You need to be in a voice channel to play music!"
      );
      return;
    }
    const voiceChannel = interaction.member.voice.channel;

    playYouTubeVideo(voiceChannel, query)
      .then(() => {
        interaction.reply(`Playing: ${query}`);
      })
      .catch((err) => {
        console.error(err);
        interaction.reply("Failed to play the requested video.");
      });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
