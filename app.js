const Discord = require('discord.js');
const config = require('./config');
const personality = require(`./gpp/${config.personality}`);

const bot_utils = require('./bot_utils');
const handlers = require('./handlers');

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
  if (message.author.id === bot.user.id) {
    // Don't reply to yourself
    return;
  }

  if (isMatch(bot, message)) {
    console.log(`[mention] ${message.author.username}: ${message.content}`);
    handlers.route(bot, message);
  }
});

function isMatch(bot, message) {
  return message.content.indexOf(bot.user.id) !== -1 
  || message.content.toLowerCase().indexOf("salmon") !== -1 
  || message.content.toLowerCase().indexOf("!catbot") !== -1
  || message.content.toLowerCase().indexOf("@catbot") !== -1
}