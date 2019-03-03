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
};const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
  msg.delete();
  let attachment;
  if ( msg.attachments.size > 0 ) {
    attachment = new Discord.Attachment(msg.attachments.first().url);
  }
  if (!msg.mentions.users.first()) {
    if (!args[0]) return msg.channel.send("❌  |  you did not provide any arguments").then(m => setTimeout(()=> m.delete(), 3000));
    const [channelID, ...message] = args;
    let channel = await bot.channels.get(channelID);
    if (!attachment) return channel.send(message.join(" "));
    channel.send(message.join(" "), { files: [attachment] });
  } else {
    args.shift();
    let DMc = await msg.mentions.users.first().createDM();
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
