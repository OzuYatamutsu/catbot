const Discord = require('discord.js');
const config = require('./config');
const handler = require('./message-handler');
const personality = require(`./gpp/${config.personality}`);

const bot = new Discord.Client();
bot.login(config.token);

bot.on('ready', _ => {
  console.log(`${bot.username}(${bot.id}) is ready, myan!`);
});

