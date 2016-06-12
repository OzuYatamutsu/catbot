const Discord = require('discord.io');
const config = require('./config');
const handler = require('./message-handler');

var bot = new Discord.Client({
  token: config.token,
  autorun: true
});

bot.on('ready', _ => {
  connectBot();
  console.log(`${bot.username}(${bot.id}) is ready, myan!`);
});

bot.on('message', (user, userId, channelId, message, event) => {
  message = message.toLowerCase()
  if (message.indexOf(bot.id) !== -1) message = "@catbot";
  if (!handler[message]) return;
  handler[message].call().then((response) => {
    bot.sendMessage({
      to: channelId,
      message: response
    });
  });
});

/*
 * Connects the bot + sets config options
 */
function connectBot() {
  const nowPlaying = config.playing;

  bot.connect();
  bot.setPresence({game: nowPlaying});
}
