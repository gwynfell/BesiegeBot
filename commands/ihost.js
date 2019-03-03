const Discord = require("discord.js");
const { embedReply } = require("../functions/embedReply.js");
const config = require("../config.json");

exports.run = async (bot, msg, args) => {

  const arenaInfo = bot.channels.get(bot.config.chanID.arenaInfo);
  let reqs = {
    "Location" : "**Where are you summoning?**",
    "Password" : "**Whats the password?**",
  };
  let embedtext = "";
  let send = true;
  let image = "https://i.imgur.com/TKiofoK.png";


  // Poll the user for the password and location.
  for (var req in reqs) {
    if (!send) break;
    const m = await embedReply(
      `❓  |  ${reqs[req]}\n            Type "exit" to cancel`,
      msg, { color: 0x42b0f4}
    );
    let collected = await msg.channel.awaitMessages(response => response.author.id === msg.author.id, {
      max: 1,
      time: 30000,
      errors: ["time"]
    }).catch(() => {
      send = false;
    });
    if (collected) {
      if (collected.first().content.toLowerCase() === "exit") { send = false; }
      reqs[req] = collected.first().content;
      collected.first().delete();
      m.delete();
    }
  }

  if (!send) return embedReply("❌  |  **Hosting abotred**", msg, {color: 0xff0000, delete: 3000});

  let hostingMsg  = await fcChannel.send(`Hello, ${msg.member.displayName} is hosting!`);
  await hostingMsg.react("❌");

  db.run("INSERT INTO FightClubs (msgID, creatorID, location, password, platform, participants) VALUES (?, ?, ?, ?, ?, ?)",
    [hostingMsgid, msg.author.id, reqs.Location, reqs.Password, platform.name, ""]);
};

// Put this function inside a reaction event. Execute when a fightclub message gets an reaction update.
exports.update = async (reaction, user) => {
  let fcMsg = reaction.message;
  db.get(`SELECT * FROM FightClubs WHERE msgID = "${fcMsg.id}"`).then(async r => {
    if (!r) return;
    if (reaction.emoji.id === "412289372759654400"){
      const reactorUsernames = await reaction.users.filter(u => !u.bot).map(u => u.username);
      let embed= new Discord.RichEmbed()
        .setAuthor(fcMsg.embeds[0].author.name, fcMsg.embeds[0].author.iconURL )
        .setColor(fcMsg.embeds[0].color)
        .setThumbnail(fcMsg.embeds[0].thumbnail.url)
        .setImage(fcMsg.embeds[0].image.url)
        .setTimestamp(fcMsg.createdAt)
        .setDescription(fcMsg.embeds[0].description);
      if (reactorUsernames.length !== 0) {
        embed.addField("Participants:", reactorUsernames.join("\n"));
      }
      fcMsg.edit(embed);
    } else if (reaction.emoji.name === "❌") {
      if (user.id !== r.creatorID && !fcMsg.guild.member(user).roles.has(config.roleID.mods)) return;
      fcMsg.delete();
      db.run(`DELETE FROM FightClubs where msgID = "${fcMsg.id}"`);
    }
  });
};

exports.conf = {
  permLevel: 3,
  guildOnly: true,
  aliases: ["ihost"]
};

exports.help = {
  name: "ihost",
  description: "Command to create a fightclub",
  usage: "fightclub"
};
