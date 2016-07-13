'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const drundelModelFactory = require('../../model/mongoose/drundel');
const drundel = require('../../domain/drundelator');

function drundelServiceFactory(connection) {
  const that = {};
  let drundels = [];

  Object.assign(that, {
    drundelize(entity) {
      const drundelFactory = drundel(entity);
      return async(() => {
        const drundelModel = drundelModelFactory(connection, entity.type);
        const docs = await(drundelModel.findAll());
        drundels = docs.map(drundelFactory);
      })();
    },

    destroy() {
      drundels.forEach(d => d.clean());
    },
  });

  return that;
}

module.exports = drundelServiceFactory;
