const generators = require('./generators');

/*
 * Returns a Promise with a static string response.
 */
function stringRespond(str) {
  return Promise.resolve(str);
}

module.exports = {
  "@catbot": _ => { return stringRespond(`_The cat completely ignores you._`) },
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
