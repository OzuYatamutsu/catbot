const Discord = require('discord.io');
const config = require('./config');

var bot = new Discord.Client({
  token: config.token,
  autorun: true
});

bot.on('ready', _ => {
  bot.connect();
  bot.setPresence({game: 'Catting around'});
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
    case 'good ket':
      bot.sendMessage({
        to: channelId,
        message: '=´∇｀='
      });
      break;
    case 'Jinhai wants a debug':
      bot.sendMessage({
        to: channelId,
        message: `yiss b0ss\nid:${bot.id}\ncid:${channelId}\nws_obj:${JSON.stringify(event)}`
      });
      break;
    case '!debug fire cat open-mouth':
      bot.sendMessage({
        to: channelId,
        message: "https://steakscorp.org/public_utils/catcons/images/cat.png"
     });
     break;
    case 'catbot you need to go to bed myan':
      bot.sendMessage({
        to: channelId,
        message: 'Time for sleeps =-w-= \n http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg'
      });
      break;
    default:
      break;
  }
});
