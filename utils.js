﻿module.exports = {
  randomItem: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  randInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}