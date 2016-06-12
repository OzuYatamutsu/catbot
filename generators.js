const googleImages = require('google-images');

module.exports = {
  "onDebugRunFunc": _ => { return Promise.resolve(9+9); },
  "findCatPic": _ => {
    const cse_id = "007659116903720282115:lxppsh-kie8";
    const api_id = "AIzaSyAxhbuxIBORj6IQv53de76fb8V-BO9IsrE";
    let client = googleImages(cse_id, api_id);
    return client.search('cat')
      .then((images) => {
        var index = Math.floor(Math.random() * images.length);
        return Promise.resolve(
          `DEBUG: I generated a ${index} with ${images.length} results\n ${images[index].url}`
        );
      });
  },
  "onDebugRand": function() {
    const len = 10;
    return Promise.resolve(Math.random());
  }
};
