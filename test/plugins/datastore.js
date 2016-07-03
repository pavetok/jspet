'use strict';

const collection = require('../datastore/collection');

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion;
  // const assert = chai.assert;
  const flag = utils.flag;

  Assertion.overwriteChainableMethod(
    'contain',

    originalMethod => {
      function assertContains(...args) {
        const object = flag(this, 'object');
        if (object.hasOwnProperty('contains')) {
          object.contains(...args);
        } else {
          originalMethod.apply(this, args);
        }
      }
      return assertContains;
    },

    originalProperty => (...args) => originalProperty.apply(this, args)
    );
};
