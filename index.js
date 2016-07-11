const Discord = require('discord.io');
const config = require('./config');
const handler = require('./message-handler');
const personality = require(config.personality);

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
  console.log("Disconnected from Discord. Reconnecting in ten seconds...");
  setTimeout(connectBot, 10000);
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
  let channels = channelsInServer(channelId);
  var handle = null;
  message = message
    .replace(`<@${bot.id}>`, `@catbot`);
  handle = handler["__i_command"](message);
  if (!handle) handle = handler[message.toLowerCase()];
  if (!handle) handle = handler["__i_userMatchOnMention"](userId, message);
  if (!handle) handle = handler["__i_fuzzyMatch"](message);
  if (!handle) return; 
  
  handle({user, userId, channelId, message, channels, bot}).then((response) => {
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
  if (bot.username != personality.name) changeName(personality.name);
  setTimeout(scheduleStatusChange, 1000);
}

/*
 * Triggers a status change and schedules the next one.
 */
function scheduleStatusChange() {
  const newStatus = personality.playing[Math.floor(Math.random() * config.playing.length)];

  changeStatus(newStatus);
  setTimeout(scheduleStatusChange, statusChangeTime);
}

/*
 * Changes the bot's status.
 */
function changeStatus(newStatus) {
  //console.log(`Changing status to: ${newStatus}`);
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

/*
 * Given a channelId, returns a list of other channels on the server.
 */
function channelsInServer(channelId) {
  const servers = bot.servers;
  for (let item of Object.keys(servers)) {
    if (!!servers[item].channels[channelId]) {
      return servers[item].channels;
    }
  }
}
