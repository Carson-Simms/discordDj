require("dotenv").config();

const ytdl = require("ytdl-core");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");

function playYouTubeVideo(voiceChannel, videoUrl, onFinish, retryCount = 0) {
  const maxRetries = process.env.YT_MAX_RECONNECT_TRIES;
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  try {
    const stream = ytdl(videoUrl, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    const player = createAudioPlayer();
    connection.subscribe(player);
    player.play(resource);

    player.on("stateChange", (oldState, newState) => {
      if (newState.status === "idle") {
        onFinish(null, connection);
      }
    });

    player.on("error", (error) => {
      console.error("Error from audio player:", error);
      if (retryCount < maxRetries) {
        console.log(`Retry ${retryCount + 1}/${maxRetries}`);
        playYouTubeVideo(voiceChannel, videoUrl, onFinish, retryCount + 1);
      } else {
        onFinish(error, connection);
      }
    });
  } catch (error) {
    console.error("Failed to play YouTube video:", error);
    if (connection.state.status !== "destroyed") {
      connection.destroy();
    }
    onFinish(error, null);
  }
}

module.exports = { playYouTubeVideo };
