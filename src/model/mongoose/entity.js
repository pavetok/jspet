'use strict';

const mongoose = require('mongoose');

const utils = require('./utils');
const modelFactory = require('./factory');

const Schema = mongoose.Schema;

const entitySchema = new Schema({
  type: String,
  props: Schema.Types.Mixed,
  calcs: Schema.Types.Mixed,
  events: Schema.Types.Mixed,
  subs: Schema.Types.Mixed,
  triggers: Schema.Types.Mixed,
});

function entityFactory(connection) {
  const MongooseModel = utils.getOrCreate(connection, 'entity', entitySchema);
  return modelFactory(MongooseModel);
}

module.exports = entityFactory;
