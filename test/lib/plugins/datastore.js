'use strict';

const datastore = require('../datastore/interface');

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
      return implemented.length === ifaceMethods.length;
    },
  };
}

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion;
  const flag = utils.flag;

  Assertion.overwriteChainableMethod(
    'contain',

    originalMethod => function assertContains(...args) {
      const object = flag(this, 'object');
      if (implementation(object).of(datastore)) {
        return object.contains(...args).then(result => new Assertion(result).to.equal(true));
      }
      return originalMethod.apply(this, args);
    },

    originalProperty => (...args) => originalProperty.apply(this, args)
    );
};
