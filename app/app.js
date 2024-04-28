require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { playYouTubeVideo } = require("./youtube/youtube-handler");

const token = process.env.DISCORD_BOT_TOKEN;
const queues = {};
const isPlaying = {};

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

client.on("messageCreate", (message) => {
  if (message.content === "dong") {
    message.reply("beau you stupid fat loser");
  }
});

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

    addToQueue(interaction.guildId, {
      voiceChannel,
      query,
      textChannel: interaction.channel,
    });
    await interaction.reply(`Queued: ${query}`);
  }
});

function playNextSong(guildId) {
  if (!queues[guildId] || queues[guildId].length === 0) {
    console.log("Queue is empty, no more songs to play.");
    isPlaying[guildId] = false;
    return;
  }

  if (isPlaying[guildId]) {
    return;
  }

  const song = queues[guildId].shift();
  isPlaying[guildId] = true;
  playYouTubeVideo(song.voiceChannel, song.query, (error, connection) => {
    isPlaying[guildId] = false;

    if (error) {
      console.error(`Error during playback: ${error.message}`);
      song.textChannel.send(`Error playing video: ${error.message}`);
      if (queues[guildId].length > 0) {
        playNextSong(guildId);
      }
      return;
    }

    let response = `Now playing: **${song.query}**`;
    if (queues[guildId].length > 0) {
      response += "\n\n**Next in queue:**\n";
      queues[guildId].slice(0, 5).forEach((queuedSong, index) => {
        response += `${index + 1}: ${queuedSong.query}\n`;
      });
    } else {
      response += "\n\n*The queue is currently empty after this song.*";
    }

    song.textChannel.send(response);

    if (queues[guildId].length > 0) {
      playNextSong(guildId);
    }
  });
}

function addToQueue(guildId, song) {
  if (!queues[guildId]) {
    queues[guildId] = [];
  }
  queues[guildId].push(song);

  if (!isPlaying[guildId]) {
    playNextSong(guildId);
  }
}

client.on("voiceStateUpdate", (oldState, newState) => {
  if (
    oldState.channelId &&
    !newState.channelId &&
    oldState.id === client.user.id
  ) {
    console.log("The bot was disconnected from a voice channel.");

    if (oldState.channel?.members.size > 1) {
      const channelId =
        oldState.guild.systemChannelId ||
        oldState.guild.channels.cache.find(
          (channel) => channel.type === "GUILD_TEXT"
        );
      if (channelId) {
        const channel = oldState.guild.channels.cache.get(channelId);
        channel.send("I was rudely disconnected! 😢 Anyone care to explain?");
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
