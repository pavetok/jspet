'use strict';

const datastore = require('../datastore');

function mongodb(spec) {
  const that = Object.create(datastore);
  const collections = Object.assign({}, spec);

  Object.assign(that, {
    collection(name) {
      collections.last = collections[name];
      return that;
    },

    contains(doc) {
      console.log(doc);
    },
  });

  return that;
}

module.exports = mongodb;
