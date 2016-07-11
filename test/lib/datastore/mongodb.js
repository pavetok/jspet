'use strict';

const datastore = require('./interface');

function mongodb(spec) {
  const that = Object.create(datastore);
  const collections = Object.assign({}, spec);

  Object.assign(that, {
    collection(name) {
      collections.current = collections[name];
      return that;
    },

    create(doc) {
      return collections.current.create(doc);
    },

    contains(doc) {
      return new Promise((resolve, reject) => {
        setImmediate(() => {
          collections.current.count(doc, (err, count) => {
            if (err) reject(err);
            resolve(count === 1);
          });
        });
      });
    },

    resetAll() {
      const promises = Object.keys(collections).map(name =>
        collections[name].remove({}).exec());
      return Promise.all(promises);
    },
  });

  return that;
}

module.exports = mongodb;
