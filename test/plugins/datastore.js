'use strict';

const collection = require('../datastore/collection');

function getOwnMethods(object) {
  return Object.getOwnPropertyNames(object).filter(key =>
    typeof object[key] === 'function');
}

function implementation(impl) {
  const implMethods = getOwnMethods(impl);
  return {
    of(iface) {
      const ifaceMethods = getOwnMethods(iface);
      const implemented = ifaceMethods.filter(method =>
        implMethods.indexOf(method) > -1);
      // return implemented.length === ifaceMethods.length;
      return implemented.length;
    },
  };
}

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion;
  // const assert = chai.assert;
  const flag = utils.flag;

  Assertion.overwriteChainableMethod(
    'contain',

    originalMethod => {
      function assertContains(...args) {
        const object = flag(this, 'object');
        if (implementation(object).of(collection)) {
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
