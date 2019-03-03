const Discord = require("discord.js");

exports.run = (bot, msg, args) => { // eslint-disable-line
  if (msg.channel.id !== bot.config.chanID.bot)
    return msg.channel.send("❌  |  You can not use that command in this channel.");

  let embed= new Discord.RichEmbed()
    	.setColor(0xb53d22)
      .setTitle(bot.user.username)
      .setDescription("**Besiege Bot** is a Discord bot programmed especially for the Besiege Bots Discord guild. \nIt allows you to easily access information about the different blocks, simulate a coin toss for choosing the arena corners, and a handfull of other features.\nBut there is more too come int the near future!\n\nType **!help** to get started.")
      .addField("Bot Owner", msg.guild.members.get(bot.config.ownerID), true)

  msg.channel.send(embed);
};



exports.conf = {
  permLevel: 0,
  aliases: ["i"]
};

exports.help = {
  name: "info",
  description: "provides information about the bot",
  usage: "info"
};
