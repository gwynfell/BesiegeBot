const Discord = require("discord.js");

exports.reactionInterface = async (user, editMsg, options) => {
  options = {
    content: options.content || "",
    color: options.color || 3901635,
    name: options.name || "Choose one",
    type: options.type || false,
    options: options.options || [],
    time: options.time || 15,
    showResult: options.showResult || false
  };
  if (!options.type) options.type = options.options.length ? "choose" : "confirm";


  //emoji lookup table used to
  const emojiLUT = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", "🇾", "🇳"];
  var emojis = ["❌"];
  var content = options.content;
  var result;
  var embed = new Discord.RichEmbed()
    .setColor(options.color)
    .setAuthor(`${user.username} | ${options.name}`,  user.avatarURL);

  switch (options.type) {
    case "confirm": //interface of the type "confirm"
      emojis = emojis.concat(emojiLUT.slice(-2)); //fill emoji array with Y and N.
      break;
    case "choose":
      if (options.options.length <= 10) { //checks if #10 <= 10
        options.options.forEach((o, i) => {
          content += `\n${emojiLUT[i]}  |  ${o}`; //add the emojis + options to the content string.
        });
        emojis = emojis.concat(emojiLUT.slice(0, options.options.length)); //fill emoji array with 1 to #options.
      } else { //send an error message if the inteface contains more than ten options
        return intfErr("⚠️  |  There must not be more than 10 options.");
      }
      break;
    default: //send an error message if the inteface type doesnt exis
      return intfErr("⚠️  |  Invalid inteface type.");
  }
  editMsg.edit(embed.setDescription(content));
  try {
    for (var i = 0; i < emojis.length; i++) {
      await editMsg.react(emojis[i]);
    }
  } catch (e) {
    return intfErr("⚠️ | One of the emojs failed to react.");
  }
  const collection = await editMsg.awaitReactions(
    (r,u) => emojis.includes(r.emoji.name) && u.id === user.id,
    { max : 1, time : 1000 * options.time }
  );
  await editMsg.clearReactions();
  if (!collection.first()) return intfErr("⚠️ | No reactions detected, this inferface timed out.");
  switch (collection.first().emoji.name) {
    case "❌":
      embed.setDescription("❌ | Interface aborted").setColor(0xdd2e44);
      result = "&a";
      break;
    case "🇾":
      embed.setDescription("✅ | Reaction detected, result: Yes").setColor(0x77b255);
      result = "&y";
      break;
    case "🇳":
      embed.setDescription("✅ | Reaction detected, result: No").setColor(0x77b255);
      result = "&n";
      break;
    default:
      embed.setDescription(`✅ | Reaction detected, result: ${options.options[emojiLUT.indexOf(collection.first().emoji.name)]}`).setColor(0x77b255);
      result = options.options[emojiLUT.indexOf(collection.first().emoji.name)];
  }

  if (options.showResult) editMsg.edit(embed);
  return result;
  function intfErr(errorMsg) {
    console.log(`Interface error: ${errorMsg.slice(5)}`);
    embed.setColor(0xffcc4d).setDescription(errorMsg);
    if (options.showResult) editMsg.edit(embed);
    return "&e";
  }
};
