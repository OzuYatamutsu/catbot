const request = require('request-promise');
const bluebird = require('bluebird'); // Promisify node callback APIs
const wolfram = require('wolfram-alpha');
const googleImages = require('google-images');
const youtubeSearch = require('youtube-search');

const config = require('./config');
const utils = require('./utils');
const personality = require(`./gpp/${config.personality}`);
const specialUserChance = 0.2; // 20% chance of triggering a special response

// Import these as var so that they're actually random
var randInt = utils.randInt;
var randItem = utils.randomItem;

module.exports = {
  route: function (bot, message) {
    let content = message.content.replace(`<@${bot.user.id}>`, '!catbot');
    let target = utils.findSubstrInStringTable(this.generators, content);
    let args = content.replace(target, "").trim().split(" ");

    if (!target)
      this.cat_response(bot, message, args);
    else
      this.generators[target](bot, message, args);
  },

  cat_response: function (bot, message, args) {
    if (Object.keys(config.special_user_table).indexOf(message.author.id) !== -1 && Math.random() < specialUserChance)
      message.channel.sendMessage(randItem(config.special_user_table[message.author.id]));
    else
      message.channel.sendMessage(randItem(personality.responses));
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
            randItem(images).url
          );
        });
    },

    // HIDDEN
    "!catbot jack in": function (bot, message, args) {
      message.channel.sendMessage(`http://steakscorp.org/expressions.png/Jacking_in.mp3`);
    },

    "!catbot pet": function (bot, message, args) {
      message.channel.sendMessage(`=´ω｀=`);
    },

    "!catbot react": function (bot, message, args) {
      let search = args.join(" ");
      if (search.length === 0) search = "cat";
      return request("http://steakscorp.org/other/expression-machine.php")
        .then((body) => {
          const items = body.split('<br />');

          // Exact matches first
          for (var item of items) {
            var ext = '';
            if (item.indexOf('.') !== -1) {
              item = item.split('.');
              ext = item[item.length - 1] ? `.${item[item.length - 1]}` : '';
              item = item.slice(0, item.length - 1).join('.');
            }

            if (utils.exactMatchWithMangling(search, item)) {
              message.channel.sendMessage(`http://steakscorp.org/expressions.png/${item}${ext}`);
              return;
            }
          }

          // Then fuzzy
          for (var item of items) {
            if (utils.fuzzyMatchWithMangling(search, item)) {
              message.channel.sendMessage(`http://steakscorp.org/expressions.png/${item}${ext}`);
              return;
            }
          }

          message.channel.sendMessage(`No reaction on Steakscorp matched search term \`${search}\`, b0ss!`);
        })
        .catch((err) => {
          message.channel.sendMessage(`ERROR! ${err}`);
        });
    },

    "!catbot roll": function (bot, message, args) {
      let range = args.map(Number);
      let result = null;
      if (range.length >= 1 && !isNaN(range[0])) {
        if (range.length >= 2 && !isNaN(range[1]))
          result = randInt(range[0], range[1]);
        else
          result = randInt(0, range[0]);
      }

      message.channel.sendMessage(result !== null
        ? `_The cat fluffles up a ${result}!_`
        : "_The cat doesn't know what to do. Try something like: `!catbot roll 6`_"
      );
    },

    "!catbot video": function (bot, message, args) {
      const undefinedVideo = "https://www.youtube.com/watch?v=undefined";
      let search = args.join(" ");
      let opts = {
        maxResults: 5,
        key: config.api_keys.google_api
      };
      let searchFunction = bluebird.promisify(youtubeSearch);

      return searchFunction(search, opts)
        .then((result) => {
          let index = 0;
          while (index > result.length
            || !result[index]
            || result[index].link === undefinedVideo
            || result[index].link.indexOf("/channel/") !== -1
          ) {
            index++;
          }
          if (index !== result.length)
            return message.channel.sendMessage(result[index].link);
          else return message.channel.sendMessage(`Couldn't find da V I D E O  b0ss =ಠ_ಥ=`);
      });
    },

    // HIDDEN
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
    },

    "help": function (bot, message, args) {
      message.channel.sendMessage(`_ａｈｈ　ｙｉｓｓ，　ｄａ　ＨＥＬＰＴＥＸＴ　ｙｏｕ　ｏｒｄｅｒ　=｀ω´=_ \n \n`
        + "**Voice channels**\n"
        + "I'm having maintenance done, so voice stuff isn't available right now, sorry :c `<apologetic sparks>`\n\n"
        + "**Text channels**\n"
        + "`@Catbot alpha <search>` - Interprets `<search>` and gives you an answer (Wolfram|Alpha).\n\n"
        + "`@Catbot catfact` - Returns a random catfact.\n\n"
        + "`@Catbot goodshit` - A meme or somethin'.\n\n"
        + "`@Catbot identify <image_link>` - Tries to tell you what your picture is!\n\n"
        + "`@Catbot img <search>` - Finds `<search>` on Google Images.\n\n"
        + "`@Catbot pet` - Pets the ket. ='w'=\n\n"
        + "`@Catbot react <search>` - Searches for the closest reaction called `<search>`.\n\n"
        + "`@Catbot roll <num> [num2]` - Rolls a random number between 0 - `<num>`, or `<num>` - `[num2]`.\n\n"
        + "`@Catbot video <search>` - Finds `<search>` on YouTube.\n\n"
        + "~Jinhai =^w^="
        + "\n\n"
        + "To handle voice channels with spaces in 'em, surround the channel name with the \\` character (e.g. **!catbot say \\`meem channel\\` meems**). See https://steakscorp.org/expressions.png/ for reactions you can use for `!catbot react`."
        + "\n"
        + "**...and more! Talk to your ket! =´∇｀=**"
      );
    },

    "salmon": function (bot, message, args) {
      const responseTable = [
        `ｔｒｅａｔｓ　ｆｏｒ　ｍｅ　？　=OwO=`,
        `ｔｒｅａｔｓ　， （=´ω｀=）`,
        `gib da ｆｅｅｓｈ　b0ss ='o'=`,
        `ｔｈａｎｋ， =´∇｀=`,
        `fiｓｈｅｓ for me？　ｒｒＲＲＲ =◕ ⋏◕=`,
        `rOUUU <3`,
        `_myooooouu_ <333`,
        `=-w-=`,
        `<3`
      ];

      message.channel.sendMessage(utils.randomItem(responseTable));
    }
  }
};