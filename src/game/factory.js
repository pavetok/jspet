'use strict';

const mongoose = require('mongoose');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const daemonInterface = require('../daemon/interface');
const entityModelFactory = require('../model/mongoose/entity');
const drundelServiceFactory = require('../service/drundel/factory');

/**
 * @implements {daemon}
 */
function game() {
  const that = Object.create(daemonInterface);
  const connection = mongoose.createConnection('mongodb://localhost/game');
  const entityModel = entityModelFactory(connection);
  const drundelService = drundelServiceFactory(connection);

  Object.assign(that, {
    start() {
      return async(() => {
        const entities = await(entityModel.findAll());
        entities.forEach(entity => drundelService.drundelize(entity));
      })();
    },

    stop() {
      connection.close();
    },
  });

  return that;
}

module.exports = game;
