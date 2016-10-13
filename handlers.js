const request = require('request-promise');
const bluebird = require('bluebird'); // Promisify node callback APIs
const wolfram = require('wolfram-alpha');
const googleImages = require('google-images');

const config = require('./config');
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
      + "`@Catbot alpha <search>` - Interprets `<search>` and gives you an answer (Wolfram|Alpha).\n\n"  
      + "`@Catbot catfact` - Returns a random catfact.\n\n"
      + "`@Catbot goodshit` - A meme or somethin'.\n\n"
      + "`@Catbot identify <image_link>` - Tries to tell you what your picture is!\n\n"
      + "`@Catbot img <search>` - Finds `<search>` on Google Images.\n\n"
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
    "!catbot alpha": function (bot, message, args) {
      const wolfram_api_key = config.api_keys.wolfram;
      let client = wolfram.createClient(wolfram_api_key, {
        reinterpret: true,
        scantimeout: 10,
        parsetimeout: 10
      });
      let search = args.join(" ");
      let queryFunction = bluebird.promisify(client.query, { context: client });
      return queryFunction(search)
        .then((result) => {
          var returnMsg = "";
          if (result.length === 0) {
            message.channel.sendMessage(`¯\_(=ツ=)_/¯ Ｉ　ｄｕｎｎｏ　ｌｏｌ`);
            return;
          }

          // Check for primary text first
          for (let pod of result) {
            if (!!pod.subpods && pod.primary) {
              returnMsg += `**${pod.subpods[0].text}**`;
              break;
            }
          }

          // If nothing, check for primary image
          if (returnMsg.length === 0) {
            for (let pod of result) {
              if (!!pod.subpods && pod.primary) {
                returnMsg = pod.subpods[0].image;
                break;
              }
            }
          }

          // If nothing, string together texts
          if (returnMsg.length === 0) {
            for (let pod of result) {
              if (!!pod.subpods && pod.subpods[0].text.trim().length > 0)
                returnMsg += `* ${pod.subpods[0].text}\n\n`;
            }
          }

          // If nothing, result is usually the second image
          if (returnMsg.length === 0) {
            if (!!result[1].subpods)
              returnMsg = result[1].subpods[0].image;
          }

          // If still nothing, no result
          if (returnMsg.length === 0)
            returnMsg = `¯\\\_(=ツ=)_/¯ Ｉ　ｄｕｎｎｏ　ｌｏｌ`;
          return message.channel.sendMessage(returnMsg);
        });
    },

    "!catbot catfact": function (bot, message, args) {
      let uri = "http://caas.steakscorp.org/api/?intro=yes";
      let options = {
        uri,
        json: true
      };

      request(options).then((body) => {
        return message.channel.sendMessage(body.text);
      });
    },

    "!catbot goodshit": function (bot, message, args) {
      message.channel.sendMessage(`👌 👀 👌 👀 👌 👀 👌 👀 👌 👀 ｇｏｏｄ　ｓｈＩｔ　ｇｏＯＤ　ＳＨＩ　Ｔ 👌 ｔ　ｈａｔ＇ｓ　ｓｏｍｅ　ＧＯＯＤ　ＫＥＴ　✔ ｒｉｇht dere b0ss . =｀ω´= 🙀 🙀 🙀 some gOODSHhit right 👌 👌 there 👌 👌 👌 right ✔ ✔ there ✔ ✔ if iｇｏ　ｋｅｔ　ｍ　ｙ　ｓｅｌ　ｆ 💯 I sssａｙ　ｓｏ 💯 ｔｈａｔ　ｗａｔ　ｉ　ｔａｌｋ　ａｂｏｕｔ　ｒｉｇｈｔ　ｄｅｒｅ　ｂ０ｓｓ　．`);
    },

    "!catbot identify": function (bot, message, args) {
      let search = args.join(" ");
      let uri = `https://www.imageidentify.com/objects/user-26a7681f-4b48-4f71-8f9f-93030898d70d/prd/urlapi?image=${search}`;
      let options = {
        uri,
        json: true
      };

      return request(options)
        .then((body) => {
          if (!body.identify || !body.identify.title) return Promise.resolve(`arr, dun knｏｗ　ｗｔｆ　ｉｓ　ｔｈａｔ　ｓｏｎ =｀ェ´=`);
          message.channel.sendMessage(`That looks like **${body.identify.title}** to me, myan!`);
        });
    },

    "!catbot img": function (bot, message, args) {
      let search = args.join(" ");
      const cse_id = config.api_keys.google_image_cse;
      const api_id = config.api_keys.google_api;
      const max_pages = 50;
      let client = new googleImages(cse_id, api_id);
      return client.search(search)
        .then((images) => {
          return message.channel.sendMessage(
            utils.randomItem(images).url
          );
        });
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