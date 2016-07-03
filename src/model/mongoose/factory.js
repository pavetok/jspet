'use strict';

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
      return MongooseModel.update({ _id: doc.id }, doc).exec();
    },
  });

  return that;
}

module.exports = modelFactory;
