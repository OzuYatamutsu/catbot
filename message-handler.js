const generators = require('./generators');
const specialUserTimeout = 30000; // ms
var ignoreSpecialUserTable = [];

/*
 * Returns a Promise with a static string response.
 */
function stringRespond(str) {
  return Promise.resolve(str);
}

/*
 * Picks a string at random from a string array 
 * and returns a Promise of it.
 */
function multiStringRespond(arr) {
  const randIndex = Math.floor(Math.random() * arr.length);
  return stringRespond(arr[randIndex]);
}

/*
 * Returns a Promise if the given string matches a token 
 * in the list. Matches as greedily as possible.
 */
function fuzzyMatch(str) {
  const table = {
    "@catbot": _ => { return multiStringRespond([
      `_The cat completely ignores you._`,
      `_The cat glares at you._`,
      `_The cat turns its head up at you._`,
      `_The cat clicks its tongue._`,
      `_The cat rifles through your wallet._`,
      `_The cat looks away from you._`,
      `_The cat nudges you away with its head._`,
      `_The cat plops down on your keyboard. That'll show you._`,
      `_The cat's ears perk up._`,
      `_Upon hearing its name, the cat goes completely numb._`,
      `_The cat silently rejects you._`
    ])},
    "pets @catbot": _ => { return stringRespond(`thank b0ss =｀ω´=`); }
  };

  const sortedKeys = Object.keys(table).sort((a, b) => {
    if (a.length < b.length) return 1;
    else if (a.length > b.length) return -1;
    return 0;
  });

  for (var key of sortedKeys) {
    if (str.indexOf(key) !== -1) return table[key];
  }

  return null;  
}

/*
 * Defines special custom responses for special user IDs 
 * on a @catbot raw mention.
 */
function userMatchOnMention(userId, message) {
  const responseTable = {
    /* Jinhai */ "104382466436907008": [
      `hi b0ss =・ω・=`,
      `yiss b0ss ? =①ω①=`
    ],
    /* Dest */ "108540178292850688": [
      `**HALLOU, ** =ΦωΦ=`
    ],
    /* Yui */ "111541372099551232": [
      `**MOW ?** =ㅇㅅㅇ=`,
      `**rrrrRRRR**rrrr...`,
      `_The cat tries to sneak up and bite Yui!_`
    ],
    /* Akashi */ "108652166176088064": [
      `_The cat clicks its tongue and gestures towards some controllers. He wants to settle it in Smash!`
    ],
  };

  if (!responseTable[userId]) return;
  else if (message.indexOf(`@catbot`) === -1) return;
  else if (ignoreSpecialUserTable.indexOf(userId) !== -1) return;
  const response = responseTable[userId][Math.floor(Math.random() * responseTable[userId].length)];
  console.log(`Triggering special response for ${userId}: ${response}`);

  // Timeout on special responses
  ignoreSpecialUserTable.push(userId);
  setTimeout(_ => {
    const userId = ignoreSpecialUserTable.shift();
    console.log(`Removed ${userId} from ignore table`);
  }, specialUserTimeout);
 
  return _ => { return stringRespond(response) };
}

module.exports = {
  "__i_fuzzyMatch": fuzzyMatch,
  "__i_userMatchOnMention": userMatchOnMention,
  "fresh steak": _ => { return stringRespond(`steak here =｀ω´=`) },
  "good ket": _ => { return stringRespond(`=´∇｀=`) },
  "bad ket": _ => { return stringRespond(`=｀ェ´=`) },
  "catbot you need to go to bed myan": _ => { return stringRespond(`Time for sleeps =-w-= \n http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg`) },
  "ping": _ => { return stringRespond(`pong`) },
  "pets catbot": _ => { return stringRespond(`=´ω｀=`); },
  "*pets catbot*": _ => { return stringRespond(`=´ω｀=`); }, 
  "!catbot pet": _ => { return stringRespond(`=´ω｀=`); },
  "!catbot catpic": generators.findCatPic,
  "!catbot reaction": generators.doCatReaction,
  "!catbot catvideo": generators.doCatVideo
};
