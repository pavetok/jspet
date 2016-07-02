'use strict';

const chai = require('chai');
const mongoose = require('mongoose');

const modelFactory = require('../src/models/mongoose/factory');

chai.should();

describe.only('Model', () => {
  mongoose.Promise = Promise;
  const MongooseModel = mongoose.model('MongooseModel', new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
  const datastore = {};
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
