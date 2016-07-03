'use strict';

const mongoose = require('mongoose');
const modelFactory = require('./factory');

const Schema = mongoose.Schema;

const drundelSchema = new Schema({
  props: Schema.Types.Mixed,
  triggers: Schema.Types.Mixed,
  events: Schema.Types.Mixed,
});

const Drundel = mongoose.model('Drundel', drundelSchema);

const drundel = modelFactory(Drundel);

module.exports = drundel;
