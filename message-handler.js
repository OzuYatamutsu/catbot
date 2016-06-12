const generators = require('./generators');

/*
 * Returns a Promise with a static string response.
 */
function stringRespond(str) {
  return new Promise(() => {
    return str;
  });
}

module.exports = {
  "Fresh steak": stringRespond(`steak here =｀ω´=`),
  "good ket": stringRespond(`=´∇｀=`),
  "Jinhai wants a debug": stringRespond(`yiss b0ss, but out of function scope!! D:`),
  "!debug fire cat open-mouth": stringRespond(`https://steakscorp.org/public_utils/catcons/images/cat.png`),
  "catbot you need to go to bed myan": stringRespond(`Time for sleeps =-w-= \n http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg`),
  "!debug run-func": generators.onDebugRunFunc(),
  "!catpic": generators.findCatPic()
};
