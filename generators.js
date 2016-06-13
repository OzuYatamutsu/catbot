const googleImages = require('google-images');
//const youtubeSearch = require('youtube-search');
const request = require('request-promise');

function randInt(max) {
  return Math.floor(Math.random() * max);
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
  "doCatVideo": _ => {
    return null; // stubbed
  }
};
