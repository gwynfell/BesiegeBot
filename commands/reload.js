exports.run = (bot, msg, args) => {
  let command;
  if (bot.commands.has(args[0])) {
    command = args[0];
  } else if (bot.aliases.has(args[0])) {
    command = bot.aliases.get(args[0]);
  }

  if (!command) {
    return msg.channel.send(`⚠️  |  I cannot find the command: ${args[0]}`);
  } else {
    msg.channel.send(`🔄  |  Reloading: ${command}`)
      .then(m => {
        bot.reload(command)
          .then(() => {
            m.edit(`✅  |  Successfully reloaded: ${command}`);
          })
          .catch(e => {
            m.edit(`❌  |  Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
          });
      });
  }
};

exports.conf = {
  permLevel: 4,
  aliases: ["rld"]
};

exports.help = {
  name: "reload",
  description: "Reloads the command file, if it has been updated or modified.",
  usage: "reload <commandname>"
};
