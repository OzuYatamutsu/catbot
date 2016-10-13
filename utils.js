﻿module.exports = {
  randomItem: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  randInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  findSubstrInStringTable: function (haystack, needle) {
    for (let i = 0; i < Object.keys(haystack).length; i++) {
      if (needle.indexOf(Object.keys(haystack)[i]) !== -1)
        return Object.keys(haystack)[i];
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
  }
}