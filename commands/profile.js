exports.run = (bot, msg, args) => {
  if (!args[0]) {
    msg.channel.send("Ping?")
      .then(m => {
        m.edit(`Pong! Latency: \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
      });
  } else {
    msg.channel.send(`You fool!\nThis is a simple ping/pong command it does not need any arguments!\n\`${args.join(" ")}\` What were you even thinking!`);
  }
};

exports.conf = {
  permLevel: 0,
  aliases: []
};

exports.help = {
  name: "ping",
  description: "Ping/Pong command to test Latency",
  usage: "ping"
};
