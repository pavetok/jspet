'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const drundelSchema = new Schema({
  props: Schema.Types.Mixed,
  calcs: Schema.Types.Mixed,
  events: Schema.Types.Mixed,
  subs: Schema.Types.Mixed,
  triggers: Schema.Types.Mixed,
});

module.exports = drundelSchema;
