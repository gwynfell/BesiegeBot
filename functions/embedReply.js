const Discord = require("discord.js");

exports.embedReply = async function (text, msgToReplyTo, options = {}) {
  const name = (msgToReplyTo.hasOwnProperty("username")) ? msgToReplyTo.username : msgToReplyTo.author.username;
  const avatarURL = (msgToReplyTo.hasOwnProperty("username")) ? msgToReplyTo.displayAvatarURL : msgToReplyTo.author.displayAvatarURL;
  const channel = (msgToReplyTo.hasOwnProperty("username")) ? msgToReplyTo : msgToReplyTo.channel;  //if the reply to message has a user name then it is not a message but a user. we use this to make the function capable of sending DM's.

  let embed = new Discord.RichEmbed()
    .setDescription(text)
    .setAuthor(name, avatarURL);
  if (options.color) embed.setColor(options.color);
  let reply = (options.editMsg) ? await options.editMsg.edit(embed) : await channel.send(embed);

  if (!options.delete || isNaN(options.delete)) return reply;
  setTimeout(()=> reply.delete(), options.delete * 1000);
};
// Sends an embed as a reply to the author of the suplied message. Options are "color" (color code) and "delete" (time in s)
