exports.run = async (client, msg, args) => {
  if (!args[0]) {
    msg.channel.send("Ping?")
      .then(m => {
        m.edit(`Pong! Latency: \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
      });
  }
  else {
    msg.channel.send(`You fool!\nThis is a simple ping/pong command it does not need any arguments!\n\`${args.join(" ")}\` What were you even thinking!`);
  }
};

exports.conf = {
  name: "ping",
  permLevel: 0,
  aliases: ["latency"],
  description: "ping-pong command to test latency",
  usage: "ping"
};
