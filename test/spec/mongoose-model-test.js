'use strict';

const mongoose = require('mongoose');

const modelFactory = require('../../src/model/mongoose/factory');
const mongodb = require('../datastore/mongodb');

describe('Model', () => {
  mongoose.Promise = Promise;
  const one = 'bars';
  const MongooseModel = mongoose.model(one, new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
  const datastore = mongodb({ [one]: MongooseModel });
  let spec;
  let doc;

  before(() => {
    mongoose.connect('mongodb://localhost/test');
  });

  beforeEach(() => datastore.resetAll());

  beforeEach(() => {
    spec = { name: 'chuck' };
    return datastore.collection(one).create(spec).then(saved => {
      doc = saved;
    });
  });

  after(() => {
    mongoose.connection.close();
  });

  it('should create doc in datastore', () =>
    datastore.collection(one).should.contain(spec)
  );

  it('should return created doc', () => {
    // when
    const promise = testModel.create(spec);
    // then
    return promise.should.eventually.contain(spec);
  });

  it('should update doc in datastore', () => {
    // given
    doc.name = spec.name = 'arnold';
    // when
    testModel.update(doc);
    // then
    return datastore.collection(one).should.contain(spec);
  });

  it('should return ok after update', () => {
    // given
    doc.name = spec.name = 'arnold';
    // when
    const promise = testModel.update(doc);
    // then
    return promise.should.eventually.contain({ ok: 1 });
  });
});
