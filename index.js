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

bot.on('disconnected', _ => {
  console.log("Disconnected from Discord. Reconnecting...");
  connectBot();
});

/*
 * Constructs a response with the following precedence:
 *
 * !catbot commands 
 * Exact matches
 * @catbot mentions for special user IDs
 * Fuzzy matches
 */
bot.on('message', (user, userId, channelId, message, event) => {
  var handle = null;
  message = message.toLowerCase()
    .replace(`<@${bot.id}>`, `@catbot`);
  
  handle = handler["__i_command"](message);
  if (!handle) handle = handler[message];
  if (!handle) handle = handler["__i_userMatchOnMention"](userId, message);
  if (!handle) handle = handler["__i_fuzzyMatch"](message);
  if (!handle) return; 
  
  handle({user, userId, channelId, message}).then((response) => {
    bot.sendMessage({
      to: channelId,
      message: response
    });
  });

  // Log out catbot mentions
  console.log(`[mention] ${user} (${userId}): ${message}`);
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
