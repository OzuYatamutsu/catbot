const generators = require('./generators');

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

module.exports = {
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
