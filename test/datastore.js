'use strict';

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion;

  Assertion.overwriteMethod('contain', doc => {
    const obj = this._obj;

    console.log(obj);
    console.log(doc);
  });
};
