const Discord = require("discord.js");
const fs = require("fs");

const hammerDB = JSON.parse(fs.readFileSync("hmr.json", "utf8"));
const hammerBots = hammerDB.bots;

exports.run = async (client, msg, args) => {  // eslint-disable-line
  const i = Math.floor(Math.random() * hammerBots.length);
  const embed = new Discord.RichEmbed()
    .setColor(0x1a70b6)
    .setAuthor(`Hammer Master Race 🔨`, `${client.user.avatarURL}`, null)
    .setImage(`http://gwynfell.ddns.net/HMR/${hammerBots[i].url}.png`)
    .addField(`${hammerBots[i].name}`, `${hammerBots[i].alias}`);
  msg.channel.send(embed);
};

exports.conf = {
  name: "hmr",
  permLevel: 0,
  aliases: ["HammerMasterRace", "Hammer", "Hammers"],
  description: "all hail the hammer master race",
  usage: "hmr"
};
