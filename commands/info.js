const Discord = require("discord.js");

exports.run = async (client, msg, args) => { // eslint-disable-line
  if (msg.channel.id !== client.config.chanID.bot) {
    return msg.channel.send("❌  |  You can not use that command in this channel.");
  }
  const embed = new Discord.RichEmbed()
    .setColor(0xb53d22)
    .setTitle(client.user.username)
    .setDescription("**Besiege Bot** is a Discord bot programmed especially for the Besiege Bots Discord guild. \nIt allows you to easily access information about the different blocks, simulate a coin toss for choosing the arena corners, and a handfull of other features.\nBut there is more too come int the near future!\n\nType **!help** to get started.")
    .addField("Bot Owner", msg.guild.members.get(client.config.ownerID), true);

  msg.channel.send(embed);
};

exports.conf = {
  name: "info",
  permLevel: 0,
  aliases: ["i"],
  description: "provides information about the bot",
  usage: "info"
};
