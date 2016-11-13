module.exports = {
  randomItem: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  randInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  findSubstrInStringTable: function (haystack, needle) {
    for (let i = 0; i < Object.keys(haystack).length; i++) {
      if (needle.indexOf(Object.keys(haystack)[i]) !== -1) {
        if (this.arrayIsSubset(needle.split(" "), Object.keys(haystack)[i].split(" ")))
          return Object.keys(haystack)[i];
      }  
    }

    return null;
  },
  exactMatchWithMangling: function (needle, haystack) {
    haystack = haystack
      .toLowerCase()
      .replace(/ /g, '_');
    needle = needle
      .toLowerCase()
      .replace(/ /g, '_');

    return haystack === needle;
  },
  fuzzyMatchWithMangling: function (needle, haystack) {
    haystack = haystack
      .toLowerCase()
      .replace(/ /g, '_');
    needle = needle
      .toLowerCase()
      .replace(/ /g, '_');

    return haystack.indexOf(needle) !== -1;
  },
  findMatchingVoiceChannel: function (bot, message, targetVoiceChannel) {
    return bot.channels.filter(
      channel => channel.type == "voice"
        && message.channel.guild != null
        && channel.guild != null
        && message.channel.guild.id === channel.guild.id
    ).find(
      channel =>
        channel.name.toLowerCase() === targetVoiceChannel.toLowerCase()
        || channel.id === targetVoiceChannel
      );
  },
  arrayIsSubset: function (arr1, arr2) {
    return JSON.stringify(arr1).indexOf(
      JSON.stringify(arr2).replace("]", "")
    ) !== -1;
  }
}