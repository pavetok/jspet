'use strict';

const collection = require('../../collection');

function collectionFactory(name) {
  const that = Object.create(collection);

  Object.assign(that, {
    get(doc) {
      console.log(doc);
    },

    has(doc) {
      console.log(doc);
    },

    contains(doc) {
      console.log(doc);
    },
  });

  return that;
}

module.exports = collectionFactory;
