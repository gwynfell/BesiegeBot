exports.run = async (client, msg, args) => {
  if (args.length != 2) return msg.channel.send("⚠️  |  You need to name two combatants!");
  const combatantOne = args[Math.floor(Math.random() * 2)];
  msg.channel.send({
    embed: {
      color: 0x1a71b8,
      title: "Blue Corner",
      description: `**${combatantOne}**`
    }
  });
  msg.channel.send({
    embed: {
      color: 0xe93b32,
      title: "Red Corner",
      description: `**${args.filter(c => c != combatantOne)}**`
    }
  });
};
exports.conf = {
  name: "corners",
  permLevel: 0,
  aliases: ["corner", "c", "sides", "side"],
  description: "radomly assigns arena corners",
  usage: "corner [Player 1] [Player 2]",
};
