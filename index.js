const config = require('./config');
var bot = new Discord.Client({
  token: config.token,
  autorun: true
});

bot.on('ready', _ => {
  bot.connect()
  console.log(`${bot.username}(${bot.id}) is ready, myan!`);
});

bot.on('message', (user, userId, channelId, message, event) => {
  switch (message) {
    case 'fresh steak':
      bot.sendMessage({
        to: channelId,
        message: 'steak here =｀ω´='
      });
      break;
    default:
      break;
  }
});
