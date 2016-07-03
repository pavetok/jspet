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
      return new Promise((resolve, reject) => {
        setImmediate(() => {
          collections.last.count(doc, (err, count) => {
            if (err) reject(err);
            resolve(count === 1);
          });
        });
      });
    },
  });

  return that;
}

module.exports = mongodb;
