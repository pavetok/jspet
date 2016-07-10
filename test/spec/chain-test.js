'use strict';

const eventbus = require('../../src/eventbus/event-emitter');
const drundel = require('../../src/domain/drundel');

describe('Action', () => {
  let action1;
  let action2;

  beforeEach(() => {
    action1 = drundel({
      triggers: { channel1: { I: 1, P: 1 } },
    });

    action2 = drundel({
      props: { probability: 0.5, multiplier: 2 },
      channels: { channel1: 'probability = probability * multiplier' },
    });
  });

  afterEach(() => {
    eventbus.cleanup();
    action1.clean();
    action2.clean();
  });

  it('should be correctly initialized', () => {
    action1.should.exist;
    action2.should.exist;
    action2.should.have.property('multiplier');
    action2.should.have.property('probability', 0.5);
  });

  it('should update probability', done => {
    setTimeout(() => {
      action2.probability.should.be.above(0.5);
      done();
    }, 2);
  });
});
