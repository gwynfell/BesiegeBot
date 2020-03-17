const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require ("fs");
const config = require("./config.json");

// extending the client for easy access in the commands.
client.config = config;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Load the contents of the `/commands/` folder and each file in it.
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  console.log(`Loading a total of ${files.length} commands.`);
  // Loops through each file in that folder
  files.forEach(f=> {
    // Check if the file has the ".js" extension.
    if(f.split(".").slice(-1)[0] !== "js") return;
    // require the file itself in memory
    const props = require(`./commands/${f}`);
    console.log(`>Loading Command: ${props.conf.name}. -success`);
    // add the command to the Commands Collection
    client.commands.set(props.conf.name, props);
    // loops through each Alias in that commands
    props.conf.aliases.forEach(alias => {
      // add the alias to the Aliasses Collection
      client.aliases.set(alias, props.conf.name);
    });
  });
});

// mesage handler
client.on("message", async msg => {
  // Ignore messages with no prefix, ignore client messages.
  if (!msg.content.startsWith(config.prefix)) return;
  // Regex code to check if the message starts with a-z, A-Z, or 0-9. Increase activity value accordingly.
  // if (/^[a-zA-Z0-9].*/.test(msg.content)) increaseActivityValue(msg.author.id);
  if (msg.author.bot) return;

  // add the arguments and command to their respective constants.
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const perms = client.elevation(msg);
  let cmd;
  // check if the command exists in commands
  if (client.commands.has(command)) {
    // Assign the command, if it exists in commands
    cmd = client.commands.get(command);
  // Check if the comman exists in Aliases
  }
  else if (client.aliases.has(command)) {
    // Assign the command, if it exists in Aliasses
    cmd = client.commands.get(client.aliases.get(command));
  }

  if (cmd) {
    // Check user's permision to use the command.
    if (perms < cmd.conf.permLevel) return msg.channel.send("❌  |  You dont have permision to use that command!");
    // Run the "exports.run()" function defined in each command.
    cmd.run(client, msg, args);
  }
});

// Ready event, write message to the console.
client.once("ready", () => {
  console.log(`Besiege Bot: Ready to serve ${client.guilds.size} servers.`);
  client.user.setPresence({ game: { name: `Besiege`, type: 0 } });
});

// Welcome message (guildMemberAdd event)
client.on("guildMemberAdd", member => {
  member.guild.channels.get(config.chanID.welcome).send(`Welcome, ${member}!\nPlease take a few moments to **carefully** read through our ${member.guild.channels.get(config.chanID.rules)}.\nAfter that, head to ${member.guild.channels.get(config.chanID.introduction)}. There you'll find all the information you need to know to get started.`);
});

// write errors and warnings to the console.
client.on("error", console.error);
client.on("warn", console.warn);

// Login to Discord.
client.login(config.token);

// function to reload a commands cache.
client.reload = function(command) {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}.js`)];
      const cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.commands.set(command, cmd);
      resolve();
    }
    catch (e) {
      reject(e);
    }
  });
};

// Calculates the permission level.
client.elevation = function(msg) {
  /* this function should resolve to an permission level which
     is then sent to the command handler for verification */
  let permlvl = 0;
  if (msg.member.roles.has(config.roleID.miniMod)) permlvl = 1;
  if (msg.member.roles.has(config.roleID.moderator)) permlvl = 2;
  if (msg.member.roles.has(config.roleID.serverOwner)) permlvl = 3;
  if (msg.author.id === config.ownerID) permlvl = 4;
  return permlvl;
};
