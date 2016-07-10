'use strict';

/* eslint no-underscore-dangle: 0 */

const model = require('../interface');

/**
 * @implements {model}
 */
function modelFactory(MongooseModel) {
  const that = Object.create(model);

  Object.assign(that, {
    create(doc) {
      return MongooseModel.create(doc);
    },

    update(doc) {
      return MongooseModel.update({ _id: doc._id }, doc).exec();
    },
  });

  return that;
}

module.exports = modelFactory;
