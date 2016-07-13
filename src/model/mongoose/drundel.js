'use strict';

const mongoose = require('mongoose');

const utils = require('./utils');
const modelFactory = require('./factory');

const Schema = mongoose.Schema;

const drundelSchema = new Schema({
  props: Schema.Types.Mixed,
});

function drundelModelFactory(connection, collection) {
  const MongooseModel = utils.getOrCreate(connection, collection, drundelSchema);
  return modelFactory(MongooseModel);
}

module.exports = drundelModelFactory;
