exports.run = async (bot, msg, args) => {
  if (!args[0]) {
    const commandNames = Array.from(bot.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.channel.send(`= Command List =\n\n[Use ${bot.config.prefix}help <commandname> for details]\n\n${bot.commands.map(c => `${bot.config.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}`).join("\n")}`, {code: "asciidoc"});
  } else {
    let command = args[0];
    if (bot.commands.has(command)) {
      command = bot.commands.get(command);

      const aliases = command.conf.aliases.length < 1 ? "none" : command.conf.aliases.join(", ");
      const usage = command.help.usage.replace(/(?:\r\n|\r|\n)/g, "\n           ");

      msg.channel.send(`= ${command.help.name} = \n${command.help.description}\naliases :: ${aliases}\nusage   :: ${usage}`, {code: "asciidoc"});
    } else {
      msg.channel.send(`⚠️  |  I cannot find the command: ${args[0]}\n**Note:** Alliases are not suported`);
    }
  }
};

exports.conf = {
  permLevel: 0,
  aliases: ["h"]
};

exports.help = {
  name: "help",
  description: "Lists all commands or information about a specific command",
  usage: "help\nhelp <commandname>"
};
