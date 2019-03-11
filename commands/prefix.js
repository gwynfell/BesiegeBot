exports.run = async (client, msg, args) => {
  if (!args[0]) {
    msg.channel.send("❌  |  you did not provide a valid prefix");
  }
  else {
    client.config.prefix = args[0];
    msg.channel.send(`✅  |  Prefix changed to: \`${client.config.prefix}\``);
  }

};

exports.conf = {
  name: "prefix",
  permLevel: 3,
  aliases: [],
  description: "changes the prefix",
  usage: "prefix [prefix]"
};
