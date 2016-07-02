'use strict';

const mongoose = require('mongoose');

const chai = require('./chai');
const modelFactory = require('../src/models/mongoose/factory');
const datastore = require('./datastore');

// chai.use(datastore);

describe('Model', () => {
  mongoose.Promise = Promise;
  const MongooseModel = mongoose.model('MongooseModel', new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
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
    const promise = testModel.create(spec);
    // then
    return promise.then(doc => {
      datastore.should.contain(doc);
      doc.should.contain(spec);
    });
  });
});
