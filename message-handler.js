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
 * Returns a Promise based on a given !catbot directive.
 */
function command(str) { 
  const table = {
    "!catbot pet": _ => { return stringRespond(`=´ω｀=`); },
    "!catbot catpic": generators.findCatPic,
    "!catbot catreaction": generators.doCatReaction,
    "!catbot catvideo": generators.doCatVideo,
    "!catbot reaction": generators.doReaction,
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
      `_The cat silently rejects you._`,
      `Mroo? ='w'=`,
      `Myon? ='w'=`,
      `MyEH ，hEH =｀ω´=`,
      `_The cat looks up at you and mouths something vulgar._`,
      `_The cat just wants to be loved._`,
      `Myerp! =owo=`,
      `Myoo!! =①ω①=`,
      `Nyeh! =●⋏●=`,
      `NYEHEHEH! ლ(●ↀωↀ●)ლ`,
      `_The cat meows at you._`,
      `_The cat begins catting immediately._`,
      `_Upon being noticed, the cat challenges you to a staring match._`,
      `https://www.youtube.com/watch?v=IuysY1BekOE`,
      `_The cat chitters at you._`,
      `_The cat myerps at you._`,
      `_The cat suffers a segfault and crashes. Rebooting..._`,
      `_The cat starts sharpening its claws on the carpet._,
      `_The cat wants a pet._`,
      `Pets please!! =^_^=`,
      `=^w^=`
    ])},
    "pets @catbot": _ => { return stringRespond(`thank b0ss =｀ω´=`); },
    "@catbot help": generators.doHelp
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
  // ...but ignore on @catbot help
  if (message.indexOf(`@catbot help`) === 0) return;
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
