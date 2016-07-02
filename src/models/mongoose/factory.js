'use strict';

const model = require('../model');

/**
 * @implements {model}
 */
function modelFactory(MongooseModel) {
  const that = Object.create(model);

  Object.assign(that, {
    create(doc) {
      return MongooseModel.create(doc).exec();
    },

    update(doc) {
      return MongooseModel.update({ _id: doc.id }, doc).exec();
    },

    findOne(query) {
      MongooseModel.findOne(query, (err, doc) => {
        if (err) throw err;
        return doc;
      });
    },

    findById(id) {
      MongooseModel.findById(id, (err, doc) => {
        if (err) throw err;
        return doc;
      });
    },

    find(query) {
      MongooseModel.find(query, (err, docs) => {
        if (err) throw err;
        return docs;
      });
    },

    findAll() {
      return MongooseModel.find({}).exec();
    },
  });

  return that;
}

module.exports = modelFactory;
