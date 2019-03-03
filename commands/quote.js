const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {

  if (!args[0] ) {
    msg.channel.send("❌  |  You need to provide a message ID or a mention").then(m => setTimeout(()=> m.delete(), 3000));
  }
  else {
    let msgToQuote;
    if (msg.mentions.members.first()) {
      try {
      msgToQuote = await msg.mentions.members.first().lastMessage;
    } catch(err) {
        return msg.channel.send("⚠️  |  Couldn't find any messages from this user.").then(m => setTimeout(()=> m.delete(), 3000));
      }
    } else if(!isNaN(args[0])) {
      try {
        msgToQuote = await msg.channel.fetchMessage(args[0]);
      } catch(err) {
        return msg.channel.send("⚠️  |  Couldn't find the message.").then(m => setTimeout(()=> m.delete(), 3000));
      }
    }
    else {
      return msg.channel.send("❌  |  You need to provide a message ID or a mention").then(m => setTimeout(()=> m.delete(), 3000));
    }
    if (msgToQuote.author.bot) return msg.channel.send("⚠️  |  You can't quoute a Bot").then(m => setTimeout(()=> m.delete(), 3000));
    let embed = await new Discord.RichEmbed()
      .setAuthor(msgToQuote.author.username, msgToQuote.author.avatarURL)
      .setColor(msg.guild.members.get(msgToQuote.author.id).highestRole.color)
      .setDescription(msgToQuote.content)
      .setTimestamp(msgToQuote.createdAt)
      .setFooter(`Message sent by ${msgToQuote.author.username} `);
    msg.channel.send(embed);
    msg.delete();
  }
};

exports.conf = {
  permLevel: 0,
  guildOnly: true,
  aliases: ["q"]
};

exports.help = {
  name: "quote",
  description: "Quote a message",
  usage: "quote <message ID or mention>"
};
