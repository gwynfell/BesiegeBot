const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
  msg.delete();
  let attachment;
  if (msg.attachments.size > 0) {
    attachment = new Discord.Attachment(msg.attachments.first().url);
  }
  if (!msg.mentions.users.first()) {
    if (!args[0]) return msg.channel.send("❌  |  you did not provide any arguments").then(m => setTimeout(()=> m.delete(), 3000));
    const [channelID, ...message] = args;
    const channel = await bot.channels.get(channelID);
    if (!attachment) return channel.send(message.join(" "));
    channel.send(message.join(" "), { files: [attachment] });
  }
  else {
    args.shift();
    const DMc = await msg.mentions.users.first().createDM();
    if (!attachment) return DMc.send(args.join(" "));
    DMc.send(args.join(" "), { files: [attachment] });
  }
};

exports.conf = {
  permLevel: 3,
  aliases: []
};

exports.help = {
  name: "say",
  description: "confidential",
  usage: "Don't bother, you don't have access."
};
