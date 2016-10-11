const utils = require('./utils');

module.exports = {
  statusChangeTime: 1200000,
  changeName: function (bot, newName) {
    bot.user
      .setUsername(newName)
      .then(user => console.log(`Changed username to ${user.username}!`))
      .catch(console.log);
  },
  scheduleStatusChange: function (bot, personalities) {
    const newStatus = utils.randomItem(personalities);

    this.changeStatus(bot, newStatus);
    setTimeout(this.scheduleStatusChange, this.statusChangeTime);
  },
  changeStatus: function (bot, newStatus) {
    bot.user
      .setStatus("online", newStatus)
      .catch(console.log);
  }
}