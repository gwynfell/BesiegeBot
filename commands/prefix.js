exports.run = (bot, msg, args) => {
  if (!args[0]) {
    msg.channel.send("❌  |  you did not provide a valid prefix");
  }
  else {
    bot.config.prefix = args[0];
    msg.channel.send(`✅  |  Prefix changed to: \`${bot.config.prefix}\``);
  }

};

exports.conf = {
  permLevel: 3,
  aliases: []
};

exports.help = {
  name: "prefix",
  description: "changes the prefix",
  usage: "prefix [prefix]"
};
