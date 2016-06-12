const generators = require('./generators');

/*
 * Returns a Promise with a static string response.
 */
function stringRespond(str) {
  return Promise.resolve(str);
}

module.exports = {
  "@catbot": _ => { return stringRespond(`_The cat completely ignores you._`) },
  "Fresh steak": _ => { return stringRespond(`steak here =｀ω´=`) },
  "good ket": _ => { return stringRespond(`=´∇｀=`) },
  "!debug fire cat open-mouth": _ => { return stringRespond(`https://steakscorp.org/public_utils/catcons/images/cat.png`) },
  "catbot you need to go to bed myan": _ => { return stringRespond(`Time for sleeps =-w-= \n http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg`) },
  "ping": _ => { return stringRespond(`pong`) },
  "!debug run-func": generators.onDebugRunFunc,
  "!catpic": generators.findCatPic,
  "!debug rand": generators.onDebugRand,
  "!catbot reaction": generators.doCatReaction
};
