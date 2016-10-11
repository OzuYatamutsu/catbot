const Discord = require('discord.js');
const config = require('./config');

const bot_utils = require('./bot_utils.js');
const handler = require('./message-handler');
const personality = require(`./gpp/${config.personality}`);

const bot = new Discord.Client();
bot.login(config.token);

bot.on('ready', _ => {
  // Change name if required
  if (bot.user.username !== personality.name)
    bot_utils.changeName(bot, personality.name);

  // Change status
  bot_utils.scheduleStatusChange(bot, personality.playing);

  // Ready!
  console.log(`${bot.user.username}(${bot.user.id}) is ready, myan!`);
});

bot.on('message', message => {
if (config.admins.indexOf(message.author.id) !== -1) {
  // DEBUG
  if (message.content.indexOf('!a') !== -1) bot.channels.find('id', "108541927376338944").sendMessage(message.content.replace("!a", ""));
  }
});

