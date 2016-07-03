'use strict';

const mongoose = require('mongoose');

const modelFactory = require('../src/models/mongoose/factory');
const mongodb = require('./datastore/mongodb');

describe('Model', () => {
  mongoose.Promise = Promise;
  const first = 'bars';
  const MongooseModel = mongoose.model(first, new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
  const datastore = mongodb({ [first]: MongooseModel });
  let spec;

  before(() => {
    mongoose.connect('mongodb://localhost/test');
  });

  beforeEach(() => {
    spec = { name: 'chuck' };
    return testModel.removeAll();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('should create doc', () => {
    // when
    testModel.create(spec);
    // then
    return datastore.collection(first).should.contain(spec);
  });

  it('should return doc', () => {
    // when
    const promise = testModel.create(spec);
    // then
    return promise.should.eventually.contain(spec);
  });
});
