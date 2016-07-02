'use strict';

const chai = require('chai');
// const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

const modelFactory = require('../src/models/mongoose/factory');

const expect = chai.expect;

// chai.use(dirtyChai);
chai.use(chaiAsPromised);
chai.should();

describe.only('Model', () => {
  mongoose.Promise = Promise;
  const MongooseModel = mongoose.model('MongooseModel', new mongoose.Schema({
    name: String,
  }));
  const testModel = modelFactory(MongooseModel);
  let doc;

  before(() => {
    mongoose.connect('mongodb://localhost/test');
  });

  beforeEach(() => {
    doc = { name: 'chuck' };
    return testModel.removeAll();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('should create doc', () =>
    testModel.create(doc).should.be.fulfilled()
  );

  it('should create doc 0', () =>
    testModel.create(doc).should.be.fulfilled().then(d => console.log(d))
  );

  it('should create doc 1', () =>
    testModel.create(doc).should.eventually.have.property('name')
  );

  it('should create doc 2', () =>
    expect(Promise.reject({ foo: 'bar' })).to.eventually.have.property('foo')
  );

  it('should create doc 3', () => {
    return Promise.resolve(2 + 2).should.eventually.equal(4);
  });

  it('should create doc 4', () => {
    return Promise.resolve(2 + 2).then(num => expect(num).to.equal(4));
  });
});
