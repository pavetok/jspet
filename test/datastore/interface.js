'use strict';

const datastore = Object.seal({
  collection() {
    throw new Error('Not implemented.');
  },

  create() {
    throw new Error('Not implemented.');
  },

  contains() {
    throw new Error('Not implemented.');
  },

  resetAll() {
    throw new Error('Not implemented.');
  },
});

module.exports = datastore;
