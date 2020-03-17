exports.run = async (client, msg, args) => {
  if (!args[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.channel.send(`= Command List =\n\n[Use ${client.config.prefix}help <commandname> for details]\n\n${client.commands.map(c => `${client.config.prefix}${c.conf.name}${" ".repeat(longest - c.conf.name.length)} :: ${c.conf.description}`).join("\n")}`, { code: "asciidoc" });
  }
  else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);

      const aliases = command.conf.aliases.length < 1 ? "none" : command.conf.aliases.join(", ");
      const usage = command.conf.usage.replace(/(?:\r\n|\r|\n)/g, "\n           ");

      msg.channel.send(`= ${command.conf.name} = \n${command.conf.description}\naliases :: ${aliases}\nusage   :: ${usage}`, { code: "asciidoc" });
    }
    else {
      msg.channel.send(`⚠️  |  I cannot find the command: ${args[0]}\n**Note:** Alliases are not suported`);
    }
  }
};

exports.conf = {
  name: "help",
  permLevel: 0,
  aliases: ["commands", "commandlist", "h"],
  description: "lists all commands or information about a specific command",
  usage: "help\nhelp <commandname>"
};
