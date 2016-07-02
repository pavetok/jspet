'use strict';

const mongoose = require('mongoose');

const drundel = require('./models/mongoose/drundel');

function game() {
  const that = {};

  that.start = function start() {
    mongoose.Promise = Promise;
    mongoose.connect('mongodb://localhost/drundel');
    drundel.findAll().then(docs => console.log(docs));
  };

  that.stop = function stop() {
    mongoose.disconnect(() => {
      console.log('disconnected');
    });
  };

  return that;
}

module.exports = game;
