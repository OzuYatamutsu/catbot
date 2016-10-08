const config = require('./config');
const generators = require('./generators');
const personality = require(`./gpp/${config.personality}`);

const specialUserTimeout = 604800000; // ms (1 week)
const specialUserChance = 0.3; // 30% chance of triggering a special response
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
 * Returns a Promise based on a given !catbot directive.
 */
function command(str) { 
  str = str.toLowerCase();
  const table = {
    "!catbot pet": _ => { return stringRespond(`=´ω｀=`); },
    "!catbot img": generators.doGoogleImage,
    "!catbot catreaction": generators.doCatReaction,
    "!catbot video": generators.doYouTube,
    "!catbot react": generators.doReaction,
    "!catbot identify": generators.doImageIdentify,
    "!catbot alpha": generators.doWolframAlpha,
    "!catbot catfact": generators.doCaas,
    "!catbot play": generators.doSoundCloudOrYouTube,
    "!catbot roll": generators.doDiceRoll,
    "!catbot stop": generators.doStopPlayingAudio,
    "!catbot shutup": generators.doStopPlayingAudio,
    "!catbot shut up": generators.doStopPlayingAudio,
    "!catbot say": generators.doTTS,
    "!catbot salmon": generators.salmonTreats,
    "!catbot goodshit": generators.doGoodShit,
    "!catbot _admin chat": generators.doAdminChat,
    "!catbot help": generators.doHelp
  };

  for (var directive of Object.keys(table)) {
    if (str.indexOf(directive) !== 0) continue;
    return table[directive];
  }

  return null;
}

/*
 * Returns a Promise if the given string matches a token 
 * in the list. Matches as greedily as possible.
 */
function fuzzyMatch(str) {
  str = str.toLowerCase();
  const table = {
    "@catbot": _ => { return multiStringRespond(personality.responses)},
    "pets @catbot": _ => { return stringRespond(`thank b0ss =｀ω´=`); },
    "@catbot help": generators.doHelp,
    "@catbot jack in": generators.doJackIn,
    "salmon": generators.salmonTreats
  };

  var sortedKeys = Object.keys(table).sort((a, b) => {
    if (a.length < b.length) return 1;
    else if (a.length > b.length) return -1;
    return 0;
  });

  // But @catbot is always last match
  sortedKeys.splice(sortedKeys.indexOf("@catbot"), 1);
  sortedKeys.push("@catbot");

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
  // ...but ignore on @catbot help
  message = message.toLowerCase();
  if (message.indexOf(`@catbot help`) === 0) return;
  if (Math.random() > specialUserChance) return;
 
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
      `_The cat clicks its tongue and gestures towards some controllers. He wants to settle it in Smash!`,
      `**MOW** =ｘェｘ= \n _The cat could **really** use a large popcorn right about now._`
    ],
    /* Soar */ "109413878584086528": [
      `_The cat hisses at Soar, to try to assert dominance over the cat competition._`
    ],
    /* Ghost */ "108673914204323840": [
      `_The cat looks at you and attempts to merf, but it failed._`
    ],
    /* Jinko  */ "108595114540056576": [
      `_The cat paws up at the rock._`,
      `_The cat sharpens his claws on Jinko._`
    ],
    /* Ashkor */ "108656606182375424": [
      `_The cat sneaks behind your defenses and upgrades your RAM._`
    ],
    /* Keizu */ "125637758520655872": [
      `_The cat brings you a spider. The spider bites you._`
    ]
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
  "__i_command": command,
  "fresh steak": _ => { return stringRespond(`steak here =｀ω´=`) },
  "good ket": _ => { return stringRespond(`=´∇｀=`) },
  "bad ket": _ => { return stringRespond(`=｀ェ´=`) },
  "catbot you need to go to bed myan": _ => { return stringRespond(`Time for sleeps =-w-= \n http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg`) },
  "ping": _ => { return stringRespond(`pong`) },
  "pets catbot": _ => { return stringRespond(`=´ω｀=`); },
  "*pets catbot*": _ => { return stringRespond(`=´ω｀=`); }
};
