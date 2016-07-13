'use strict';

const mongoose = require('mongoose');

const gameFactory = require('../../src/game/factory');
const entityModelFactory = require('../../src/model/mongoose/entity');
const drundelModelFactory = require('../../src/model/mongoose/drundel');

describe('Game', () => {
  const game = gameFactory();
  const connection = mongoose.createConnection('mongodb://localhost/game');
  const entityModel = entityModelFactory(connection);
  const drundelModel = drundelModelFactory(connection, 'drundel');
  let entity;
  let drundel;

  beforeEach(() => {
    entity = {
      type: 'drundel',
      props: { p: 2 },
      calcs: {},
      events: {},
      subs: {},
      triggers: {},
    };
  });

  beforeEach(() => {
    drundel = {
      props: {},
    };
  });

  beforeEach(() => Promise.all([
    entityModel.removeAll(),
    drundelModel.removeAll(),
  ]));

  beforeEach(() => Promise.all([
    entityModel.create(entity),
    drundelModel.create(drundel),
  ]));

  beforeEach(() => game.start());

  afterEach(() => {
    game.stop();
  });

  it('should properly start', () => {

  });
});
