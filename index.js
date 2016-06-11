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
  if (!handler[message]) return;
  bot.sendMessage({
    to: channelId,
    message: handler[message]
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
