'use strict';

/* eslint no-unused-vars: 0 */

const datastore = Object.seal({
  collection(name) {
    throw new Error('Not implemented.');
  },

  create(doc) {
    throw new Error('Not implemented.');
  },

  contains(doc) {
    throw new Error('Not implemented.');
  },

  resetAll() {
    throw new Error('Not implemented.');
  },
});

module.exports = datastore;
