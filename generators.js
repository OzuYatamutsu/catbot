const bluebird = require('bluebird'); // Promisify node callback APIs
const googleImages = require('google-images');
//const youtubeSearch = require('youtube-search');
const request = require('request-promise');
const wolfram = require('wolfram-alpha');

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

module.exports = {
  "findCatPic": _ => {
    const cse_id = "007659116903720282115:lxppsh-kie8";
    const api_id = "AIzaSyAxhbuxIBORj6IQv53de76fb8V-BO9IsrE";
    const max_pages = 50;
    let client = googleImages(cse_id, api_id);
    return client.search('cat', { page: randInt(max_pages) })
      .then((images) => {
        return Promise.resolve(images[randInt(images.length)].url);
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
    let search = args.message.split("!catbot reaction")[1].trim();
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
  "doCatVideo":  _ => {
    return null; // stubbed
  },
  "doWolframAlpha": (args) => {
    let client = wolfram.createClient('5Y398Q-JU8LR2EY68');
    let search = args.message.split("!catbot alpha")[1].trim();
    let queryFunction = bluebird.promisify(client.query, {context: client});
    return queryFunction(search)
      .then((result) => {
        var returnMsg = "";
        //console.log(`[wolfram] ${JSON.stringify(result)}`); // TODO debug
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
            if (!!pod.subpods)
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
  "doHelp": _ => {
    return Promise.resolve(`_ａｈｈ　ｙｉｓｓ，　ｄａ　ＨＥＬＰＴＥＸＴ　ｙｏｕ　ｏｒｄｅｒ　=｀ω´=_ \n \n` 
    + "```\n"
    + "!catbot alpha <search> - Interprets <search> and gives you an answer (Wolfram|Alpha).\n"
    + "!catbot catpic - Returns a random cat picture.\n"
    + "!catbot catreaction - Returns a random cat reaction.\n"
    + "!catbot reaction <search> - Searches for the closest reaction called <search>.\n"
    + "\n"
    + "~Jinhai =^_^="
    + "```"
    + "\n"
    + "(Reactions are sourced from https://steakscorp.org/expressions.png/)"
    + "\n"
    + "**...and more! Talk to your ket! =´∇｀=**");
  }
};
