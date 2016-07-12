'use strict';

/* eslint no-underscore-dangle: 0 */

const modelInterface = require('../interface');

/**
 * @implements {model}
 */
function modelFactory(MongooseModel) {
  const that = Object.create(modelInterface);

  Object.assign(that, {
    create(doc) {
      return MongooseModel.create(doc);
    },

    update(doc) {
      return MongooseModel.update({ _id: doc._id }, doc).exec();
    },

    findAll() {
      return MongooseModel.find({}).exec();
    },

    removeAll() {
      return MongooseModel.remove({}).exec();
    },
  });

  return that;
}

module.exports = modelFactory;
