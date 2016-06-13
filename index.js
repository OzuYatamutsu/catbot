const Discord = require('discord.io');
const config = require('./config');
const handler = require('./message-handler');

// (20 minutes)
const statusChangeTime = 1200000; // ms until catbot status change

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
  const nowPlaying = config.playing[Math.floor(Math.random() * config.length)];

  bot.connect();
  setTimeout(scheduleStatusChange, 1000);
}

/*
 * Triggers a status change and schedules the next one.
 */
function scheduleStatusChange() {
  const newStatus = config.playing[Math.floor(Math.random() * config.playing.length)];
  changeStatus(newStatus);
  setTimeout(scheduleStatusChange, statusChangeTime);
}

/*
 * Changes the bot's status.
 */
function changeStatus(newStatus) {
  console.log(`Changing status to: ${newStatus}`);
  bot.setPresence({game: newStatus});
}

/*
 * Changes the bot's name.
 */
function changeName(newName) {
  console.log(`Changing name to: ${newName}`);
  bot.editUserInfo({username: newName});
  bot.username = newName;
}
