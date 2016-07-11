'use strict';

const mongoose = require('mongoose');

module.exports = {
  getOrCreate(name, schema) {
    try {
      return mongoose.model(name);
    } catch (error) {
      return mongoose.model(name, schema);
    }
  },
};
