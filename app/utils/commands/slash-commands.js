const commands = [
  {
    name: "play",
    description: "Plays a song from YouTube",
    options: [
      {
        type: 3,
        name: "query",
        description: "The search query to find and play music",
        required: true,
      },
    ],
  },
  // more commands here
];

module.exports = commands;
