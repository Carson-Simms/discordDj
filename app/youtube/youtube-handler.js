const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

function playYouTubeVideo(voiceChannel, videoUrl) {
  return new Promise((resolve, reject) => {
    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

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
        console.log(
          `Transitioned from ${oldState.status} to ${newState.status}`
        );
        if (newState.status === "autopaused") {
          console.log("Stream auto-paused, attempting to resume...");
          player.unpause();
        }
        if (newState.status === "idle") {
          console.log("Playback finished or failed, destroying connection...");
          connection.destroy();
        }
      });

      player.on("error", (error) => {
        console.error("Error from audio player:", error);
        connection.destroy();
        reject(error);
      });
    } catch (error) {
      console.error("Failed to play YouTube video:", error);
      reject(error);
    }
  });
}

module.exports = { playYouTubeVideo };
