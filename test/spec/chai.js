'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
// const dirtyChai = require('dirty-chai');

const datastoreChai = require('../plugins/datastore');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
// chai.use(dirtyChai);

chai.use(datastoreChai);

module.exports = chai;
