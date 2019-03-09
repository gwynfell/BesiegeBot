module.exports.run = async (client, message, args) => {
  const emojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", "👍", "👎", "🤷"];
  function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
  }
  function react(i, n) {
    if (i > n) return;
    message.react(emojis[i]).then(() => react(++i, n));
  }
  if (isInt(args[0])) {
    if (args[0] > 10 || args[0] < 2) return message.channel.send("The amount of options must be between 2 and 10.").then(msg => msg.delete(10000));
    react(0, args[0] - 1);
  }
  else {
    react(10, 12);
  }
};

exports.conf = {
  permLevel: 0,
  aliases: ["poll", "v"]
};

exports.help = {
  name: "vote",
  description: "create a vote ",
  usage: "vote :: create a reaction based vote"
};
