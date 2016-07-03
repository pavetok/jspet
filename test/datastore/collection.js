'use strict';

const collection = Object.seal({
  get() {
    throw new Error('Not implemented.');
  },

  has() {
    throw new Error('Not implemented.');
  },

  contains() {
    throw new Error('Not implemented.');
  },
});

module.exports = collection;
