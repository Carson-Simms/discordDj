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
  {
    name: "test",
    description: "test",
  },
  // more commands here
];

module.exports = commands;
