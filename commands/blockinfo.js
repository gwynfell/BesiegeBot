const Discord = require("discord.js");
const fs = require("fs");

const blockDB = JSON.parse(fs.readFileSync("blockInfo.json", "utf8"));
const blockInfo = blockDB.blocks;


exports.run = (bot, msg, args) => {
  if (args[0] === "alphabetic" || args[0] === "a") sortAndSend(blockInfo, "name");
  else if (args[0] === "weight" || args[0] === "w" ) sortAndSend(blockInfo, "weight");
  else if (!args[0] || args[0] === "id" || args[0] === "Id" || args[0] === "ID") sortAndSend(blockInfo, "ID");
  else {
      sortByKey(blockInfo, "ID");
      if (parseInt(args[0])%1 === 0 && parseInt(args[0]) < blockInfo.length) {
        sendEmbed(parseInt(args[0]));
      }
      else if (parseInt(args[0])%1 === 0 && parseInt(args[0]) >= blockInfo.length) {
        msg.channel.send(`At the moment there are only ${blockInfo.length} blocks in this game.`)
      }
      else {
        let blockName = args.join(" ");
        for (var i = 0; i < blockInfo.length; i++) {
          if  (blockName.toLowerCase() === blockInfo[i].name.toLowerCase() || blockInfo[i].aliases.includes(blockName.toLowerCase()))  {
            return sendEmbed(i);
          }
          if (i+1 === blockInfo.length){
            msg.channel.send(`There is no block named ${blockName}.\nUse ${bot.config.prefix}bi to list all blocks and their respective IDs.`)
          }
        }
      }
  }

  function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  function sendEmbed(i) {
    let embed= new Discord.RichEmbed()
      .setColor(0x1a70b6)
      .setAuthor(`Blockinfo | ${blockInfo[i].name}`, `${bot.user.avatarURL}`, null)
      .setImage(`http://gwynfell.ddns.net/BesiegeBlocks/${i}.png`)
      .addField(`ID`, `${i}`, true)
      .addField(`Weight`, `${blockInfo[i].weight}`, true)
      .addField(`Destructible`, `${blockInfo[i].destructible}`, true)
      //.addField(`Friction`, `${blockInfo[i].friction}`, true)
      //.addField(`Flexural Strength`,`**X** | ${blockInfo[i].flexuralStrength.x}\n**Y** | ${blockInfo[i].flexuralStrength.y}\n**Z** | ${blockInfo[i].flexuralStrength.z}`, true)
      //.addField(`Shear Strength`,`${blockInfo[i].shearStrength}`, true);
    return msg.channel.send(embed);
  }

  function sortAndSend(array, key) {
    sortByKey(array, key);
    let string = "";
    for (i = 0; i < array.length; i++) {
      if (blockInfo[i].ID.toString().length == 1) { string += "0" }
      string += `${array[i].ID} :: ${array[i].name}\n`;
    }
    msg.channel.send(`= All blocks and their respective IDs sorted by ${key}=\n\n[Use ${bot.config.prefix}bi <ID / name> for details]\n\n${string}`, {code: "asciidoc"});
  }
};

exports.conf = {
  permLevel: 0,
  aliases: ["bi", "blocks"]
};

exports.help = {
  name: "blockinfo",
  description: "List of all blocks or information about a specific block",
  usage: "blockinfo :: list all blocks in Besiege sorted by their ID\nblockinfo alphabetic :: sort them alphabetically\nblockinfo <blockname / blockID> :: details on a specific block"
};
