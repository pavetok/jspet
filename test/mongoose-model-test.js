'use strict';

const mongoose = require('mongoose');

const chai = require('./chai');
const modelFactory = require('../src/models/mongoose/factory');
const mongodb = require('./datastore/mongo/db');
const datastoreChai = require('./plugins/datastore');

chai.use(datastoreChai);

describe('Model', () => {
  mongoose.Promise = Promise;
  const MongooseModel = mongoose.model('Model', new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
  const datastore = mongodb();
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
      datastore.collection('models').should.contain(doc);
      doc.should.contain(spec);
    });
  });
});
