const googleImages = require('google-images');

module.exports = {
  "onDebugRunFunc": _ => { return 9+9; },
  "findCatPic": _ => {
    const cse_id = "007659116903720282115:lxppsh-kie8";
    const api_id = "AIzaSyAxhbuxIBORj6IQv53de76fb8V-BO9IsrE";
    let client = googleImages(cse_id, api_id);
    client.search('cat')
      .then((images) => {
        return images[0]; 
      });
  }
};
