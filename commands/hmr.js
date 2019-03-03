const Discord = require("discord.js");
const fs = require("fs");

const hammerDB = JSON.parse(fs.readFileSync("hmr.json", "utf8"));
const hammerBots = hammerDB.bots;

exports.run = (bot, msg, args) => {
  var i = Math.floor( Math.random() * hammerBots.length );
  let embed= new Discord.RichEmbed()
      .setColor(0x1a70b6)
      .setAuthor(`Hammer Master Race 🔨`, `${bot.user.avatarURL}`, null)
      .setImage(`http://gwynfell.ddns.net/HMR/${hammerBots[i].url}.png`)
      .addField(`${hammerBots[i].name}`, `${hammerBots[i].alias}`)
  msg.channel.send(embed);
};

exports.conf = {
  permLevel: 0,
  aliases: ["HammerMasterRace", "Hammer", "Hammers"]
};

exports.help = {
  name: "hmr",
  description: "All hail the hammer master race",
  usage: "hmr :: shows a random bot from the hammer master race"
};
