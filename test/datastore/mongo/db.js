'use strict';

const datastore = require('../datastore');
const collectionFactory = require('./collection/factory');

function mongodb() {
  const that = Object.create(datastore);

  Object.assign(that, {
    collection(name) {
      return collectionFactory(name);
    },
  });

  return that;
}

module.exports = mongodb;
