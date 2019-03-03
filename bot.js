const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require ("fs");
const config = require("./config.json");
const reactionInterface = require("./functions/reactionInterface.js")

// extending the bot client for easy access in the commands.
bot.config = config;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.interface = reactionInterface;

// Load the contents of the `/commands/` folder and each file in it.
fs.readdir("./commands/",(err, files) => {
  if (err) console.error(err);
  console.log(`Loading a total of ${files.length} commands.`);
  // Loops through each file in that folder
  files.forEach(f=> {
    // Check if the file has the ".js" extension.
    if(f.split(".").slice(-1)[0] !== "js") return;
    //require the file itself in memory
    let props = require(`./commands/${f}`);
    console.log(`>Loading Command: ${props.help.name}. -success`);
    // add the command to the Commands Collection
    bot.commands.set(props.help.name, props);
    // loops through each Alias in that commands
    props.conf.aliases.forEach(alias => {
      // add the alias to the Aliasses Collection
      bot.aliases.set(alias, props.help.name);
    });
  });
});

// mesage handler
bot.on("message", async msg => {
  // Ignore messages with no prefix, ignore bot messages.
  if (!msg.content.startsWith(config.prefix)) return;
  if (msg.author.bot) return;

  // add the arguments and command to their respective constants.
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let perms = bot.elevation(msg);
  let cmd;
  // check if the command exists in commands
  if (bot.commands.has(command)) {
    // Assign the command, if it exists in commands
    cmd = bot.commands.get(command);
  // Check if the comman exists in Aliases
  } else if (bot.aliases.has(command)) {
    // Assign the command, if it exists in Aliasses
    cmd = bot.commands.get(bot.aliases.get(command));
  }

  if (cmd) {
    // Check user's permision to use the command.
    if (perms < cmd.conf.permLevel) return msg.channel.send("❌  |  You dont have permision to use that command!");
    // Run the "exports.run()" function defined in each command.
    cmd.run(bot, msg, args);
  }
});

// Ready event, write message to the console.
bot.on("ready",() => {
  console.log(`Besiege Bot: Ready to serve ${bot.guilds.size} servers.`);
  bot.user.setPresence({ game: {name: `Besiege`, type: 0 } });
});

// Welcome message (guildMemberAdd event)
bot.on('guildMemberAdd', member => {
  member.guild.channels.get(config.chanID.welcome).send(`Welcome, ${member}!\nMake sure to check ${member.guild.channels.get(config.chanID.arenaInfo)} for the times at which the server is usually up.\nIn ${member.guild.channels.get(config.chanID.gallery)} you can find some inspiration.`);
});

// write errors and warnings to the console.
bot.on("error", console.error);
bot.on("warn", console.warn);

// Login to Discord.
bot.login(config.token);

// function to reload a commands cache.
bot.reload = function (command) {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}.js`)];
      let cmd = require(`./commands/${command}`);
      bot.commands.delete(command);
      bot.commands.set(command, cmd);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

// Calculates the permission level.
bot.elevation = function (msg) {
  /* this function should resolve to an permission level which
     is then sent to the command handler for verification */
  let permlvl = 0;
  if (msg.member.roles.has(config.roleID.contributor)) permlvl = 1;
  if (msg.member.roles.has(config.roleID.moderator)) permlvl = 2;
  if (msg.member.roles.has(config.roleID.serverOwner)) permlvl = 3;
  if (msg.author.id === config.ownerID) permlvl = 4;
  return permlvl;
};
