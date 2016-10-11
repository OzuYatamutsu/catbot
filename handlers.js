﻿const config = require('./config');
const utils = require('./utils');

module.exports = {
  route: function (bot, message) {
    let content = message.content.replace(`<@${bot.user.id}>`, '!catbot');
    let target = utils.findSubstrInStringTable(this.generators, content);
    let args = content.replace(target, "").trim().split(" ");

    if (!target)
      this.help(message);
    else
      this.generators[target](bot, message, args);
  },

  help: function (message) {
    message.channel.sendMessage(`_ａｈｈ　ｙｉｓｓ，　ｄａ　ＨＥＬＰＴＥＸＴ　ｙｏｕ　ｏｒｄｅｒ　=｀ω´=_ \n \n`
      + "I'm having maintenance done, so some stuff isn't available right now, sorry :c `<apologetic sparks>`\n\n"
      + "`@Catbot goodshit` - A meme or somethin'.\n\n"
      + "`@Catbot pet` - Pets the ket. ='w'=\n\n"
      + "`@Catbot roll <num> [num2]` - Rolls a random number between 0 - `<num>`, or `<num>` - `[num2]`.\n\n"
      + "~Jinhai =^w^="
      + "\n\n"
      + "To handle voice channels with spaces in 'em, surround the channel name with the \\` character (e.g. **!catbot say \\`meem channel\\` meems**). See https://steakscorp.org/expressions.png/ for reactions you can use for `!catbot react`."
      + "\n"
      + "**...and more! Talk to your ket! =´∇｀=**"
    );
  },

  generators: {
    "!catbot goodshit": function (bot, message, args) {
      message.channel.sendMessage(`👌 👀 👌 👀 👌 👀 👌 👀 👌 👀 ｇｏｏｄ　ｓｈＩｔ　ｇｏＯＤ　ＳＨＩ　Ｔ 👌 ｔ　ｈａｔ＇ｓ　ｓｏｍｅ　ＧＯＯＤ　ＫＥＴ　✔ ｒｉｇht dere b0ss . =｀ω´= 🙀 🙀 🙀 some gOODSHhit right 👌 👌 there 👌 👌 👌 right ✔ ✔ there ✔ ✔ if iｇｏ　ｋｅｔ　ｍ　ｙ　ｓｅｌ　ｆ 💯 I sssａｙ　ｓｏ 💯 ｔｈａｔ　ｗａｔ　ｉ　ｔａｌｋ　ａｂｏｕｔ　ｒｉｇｈｔ　ｄｅｒｅ　ｂ０ｓｓ　．`);
    },

    "!catbot pet": function (bot, message, args) {
      message.channel.sendMessage(`=´ω｀=`);
    },

    "!catbot roll": function (bot, message, args) {
      let range = args.map(Number);
      let result = null;
      if (range.length >= 1 && !isNaN(range[0])) {
        if (range.length >= 2 && !isNaN(range[1]))
          result = utils.randInt(range[0], range[1]);
        else
          result = utils.randInt(0, range[0]);
      }

      message.channel.sendMessage(result !== null
        ? `_The cat fluffles up a ${result}!_`
        : "_The cat doesn't know what to do. Try something like: `!catbot roll 6`_"
      );
    },

    "!catbot _admin chat": function (bot, message, args) {
      let admins = config.admins;
      let author = message.author.id;
      let target_channel_id = args[0];
      let text = args.slice(1, args.length).join(" ");

      // If the person is not an admin, silently fail
      if (admins.indexOf(author) === -1)
        return;

      bot.channels
        .find('id', target_channel_id)
        .sendMessage(text);
    }
  }
};