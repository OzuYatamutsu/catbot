const config = require('./config'); // For API keys
const bluebird = require('bluebird'); // Promisify node callback APIs
const googleImages = require('google-images');
const youtubeSearch = require('youtube-search');
const request = require('request-promise');
const wolfram = require('wolfram-alpha');
const youtubeAudio = require('youtube-audio-stream');
const googleTTS = require('google-tts-api');
const fs = require('fs');

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function exactMatchWithMangling(needle, haystack) {
  haystack = haystack
    .toLowerCase()
    .replace(/ /g, '_');
  needle = needle
    .toLowerCase()
    .replace(/ /g, '_');

  return haystack === needle;
}

function fuzzyMatchWithMangling(needle, haystack) {
  haystack = haystack
    .toLowerCase()
    .replace(/ /g, '_');
  needle = needle
    .toLowerCase()
    .replace(/ /g, '_');
 
  return haystack.indexOf(needle) !== -1;
}

function findChannelIdByName(channels, name, type) {
  for (let channel of Object.keys(channels)) {
    if ((channel === name.toLowerCase().trim() 
      || channels[channel].name.toLowerCase() === name.toLowerCase().trim())
      && channels[channel].type === type) {
      return channel;
    }
  }
}

module.exports = {
  "doGoogleImage": (args) => {
    let search = args.message.split("!catbot img")[1].trim();
    const cse_id = config.api_keys.google_image_cse;
    const api_id = config.api_keys.google_api;
    const max_pages = 50;
    let client = googleImages(cse_id, api_id);
    return client.search(search)
      .then((images) => {
        return Promise.resolve(images[0].url);
      });
  },
  "doCatReaction": _ => {
    return request("http://steakscorp.org/other/expression-machine-cat-only.php")
      .then((body) => {
        const items = body.split('<br />');
        var index = Math.floor(Math.random() * items.length);
          
        return Promise.resolve(`http://steakscorp.org/expressions.png/${items[index]}`);
       })
      .catch((err) => {
        return Promise.resolve(`ERROR! ${err}`);
      });
  },
  "doReaction": (args) => {
    let search = args.message.split("!catbot react")[1].trim();
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

          if (exactMatchWithMangling(search, item))
            return Promise.resolve(`http://steakscorp.org/expressions.png/${item}${ext}`);
        }
        
        // Then fuzzy
        for (var item of items) {
          if (fuzzyMatchWithMangling(search, item))
            return Promise.resolve(`http://steakscorp.org/expressions.png/${item}${ext}`);
        }
        
        return Promise.resolve(`No reaction on Steakscorp matched search term \`${search}\`, b0ss!`);
      })
      .catch((err) => {
        return Promise.resolve(`ERROR! ${err}`);
      });
  },
  "doYouTube": (args) => {
    const undefinedVideo = "https://www.youtube.com/watch?v=undefined";
    let search = args.message.split("!catbot video")[1].trim();
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
        if (index !== result.length) return Promise.resolve(result[index].link);
        else return Promise.resolve(`Couldn't find da V I D E O  b0ss =ಠ_ಥ=`);
      });
  },
  "doWolframAlpha": (args) => {
    const wolfram_api_key = config.api_keys.wolfram;
    let client = wolfram.createClient(wolfram_api_key, {
      reinterpret: true,
      scantimeout: 10,
      parsetimeout: 10
    });
    let search = args.message.split("!catbot alpha")[1].trim();
    let queryFunction = bluebird.promisify(client.query, {context: client});
    return queryFunction(search)
      .then((result) => {
        var returnMsg = "";
        if (result.length === 0) return Promise.resolve(`¯\_(=ツ=)_/¯ Ｉ　ｄｕｎｎｏ　ｌｏｌ`);

        // console.log(`[wolfram] ${JSON.stringify(result)}`); // TODO debug
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
        return Promise.resolve(returnMsg);
      });
  },
  "doImageIdentify": (args) => {
    let search = args.message.split("!catbot identify")[1].trim();
    let uri = `https://www.imageidentify.com/objects/user-26a7681f-4b48-4f71-8f9f-93030898d70d/prd/urlapi?image=${search}`;
    let options = {
      uri,
      json: true
    };
    
    return request(options)
      .then((body) => {
        if (!body.identify || !body.identify.title) return Promise.resolve(`arr, dun knｏｗ　ｗｔｆ　ｉｓ　ｔｈａｔ　ｓｏｎ =｀ェ´=`);
        return Promise.resolve(`That looks like **${body.identify.title}** to me, myan!`);
      });
  },
  "doCaas": _ => {
    let uri = "http://caas.steakscorp.org/api/?intro=yes";
    let options = {
      uri,
      json: true
    };

    return request(options)
      .then((body) => {
        return Promise.resolve(body.text);
      });
  },
  "doPlayYouTubeInVoiceChannel": (args) => {
    let channels = args.channels;
    let search = args.message.split("!catbot play")[1].trim();
    let channel = search.split(" ")[0].trim();
    let link = search.replace(channel, "").trim()
      .replace(".", "");
    let id = findChannelIdByName(channels, channel, "voice");
   
    if (!id || channels[id].type !== "voice") {
      return Promise.resolve(`\`${channel}\` doesn't exist or isn't a voice channel, myan!`);
    }

    let yt_stream = fs.createWriteStream(id);

    try { 
      youtubeAudio(link).pipe(yt_stream);
    } catch (err) {
      return Promise.resolve(`\`${link}\` doesn't have a video I can play, b0ss!`);
    }
    
    yt_stream.on('finish', _ => {
      args.bot.joinVoiceChannel(id, _ => {
        args.bot.getAudioContext({channel: id, stereo: true}, (stream) => {
          args.bot.sendMessage({
            to: args.channelId, 
            message: `Now playing, b0ss!`
          });
          stream.playAudioFile(id);
          stream.once('fileEnd', function() {
            console.log(`[voice] Removing stream ${id}, ended.`);
            try {
              fs.unlinkSync(id);
            } catch (err) {}
            args.bot.leaveVoiceChannel(id);
          });
        });
      });
    });
      
    return Promise.resolve(`Loading audio stream, b0ss!`);
  },
  "doStopPlayingAudio": (args) => {
    const channels = args.channels;
    for (let channel of Object.keys(channels)) {
      if (channels[channel].type === "voice") {
        if (Object.keys(channels[channel].members).indexOf(args.bot.id) !== -1) {
          args.bot.getAudioContext(channel, stream => {
            stream.stopAudioFile();
          });
        }

        // And delete stale audio streams if exist
        try {
          fs.statSync(channel).isFile();
          fs.unlinkSync(channel);
        } catch (err) {}
      }
    }

    return Promise.resolve(`yiss b0ss =;w;=`);
  },
  "doTTS": (args) => {
    let channels = args.channels;
    let search = args.message.split("!catbot say")[1].trim();
    let channel = search.split(" ")[0].trim();
    let text = search.replace(channel, "").trim();
    let id = findChannelIdByName(channels, channel, "voice");
    
    if (!id || channels[id].type !== "voice") {
      return Promise.resolve(`\`${channel}\` doesn't exist or isn't a voice channel, myan!`);
    }   

    let tts_stream = fs.createWriteStream(id);

    googleTTS(text, 'en', 1)
      .then((url) => {
        request(url).pipe(tts_stream);
      });
    tts_stream.on('finish', _ => {
      args.bot.joinVoiceChannel(id, _ => {
        args.bot.getAudioContext({channel: id, stereo: true}, (stream) => {
          stream.playAudioFile(id);
          stream.once('fileEnd', function() {
            console.log(`[voice] Removing stream ${id}, ended.`);
            try {
              fs.unlinkSync(id);
            } catch (err) {}
            args.bot.leaveVoiceChannel(id);
          });
        });
      });
    });
  
    return Promise.resolve(``);
  },
  // Admin feature
  "doAdminChat": (args) => {
    let admins = config.admins;
    let servers = args.bot.servers;
    let search = args.message.split("!catbot _admin chat")[1].trim();
    let channel_id = search.split(" ")[0].trim();
    let text = search.replace(channel_id, "").trim();
   
    if (admins.indexOf(userId) !== -1) {
      args.bot.sendMessage({
        to: channel_id, 
        message: text
      });
    }

    return Promise.resolve(``);
  },
  "doHelp": _ => {
    return Promise.resolve(`_ａｈｈ　ｙｉｓｓ，　ｄａ　ＨＥＬＰＴＥＸＴ　ｙｏｕ　ｏｒｄｅｒ　=｀ω´=_ \n \n`
    + "**Voice channels**\n"
    + "`!catbot say <voice_channel> <text>` - Speaks `<text>` in `<voice_channel>`.\n\n"
    + "`!catbot play <voice_channel> <youtube_link>` - Plays a YouTube video in `<voice_channel>`.\n\n"
    + "`!catbot stop` - Makes Catbot stop playing audio in voice channels.\n\n"
    + "**Text channels**\n"
    + "`!catbot alpha <search>` - Interprets `<search>` and gives you an answer (Wolfram|Alpha).\n\n"  
    + "`!catbot catfact` - Returns a random catfact.\n\n"
    + "`!catbot identify <image_link>` - Tries to tell you what your picture is!\n\n"
    + "`!catbot img <search>` - Finds `<search>` on Google Images.\n\n"
    + "`!catbot react <search>` - Searches for the closest reaction called `<search>`.\n\n"
    + "`!catbot video <search>` - Finds `<search>` on YouTube.\n\n"
    + "~Jinhai =^w^="
    + "\n"
    + "(See https://steakscorp.org/expressions.png/ for reactions you can use for `!catbot react`)"
    + "\n"
    + "**...and more! Talk to your ket! =´∇｀=**");
  }
};
