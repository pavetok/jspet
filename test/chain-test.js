'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const eventbus = require('../src/eventbus');
const drundel = require('../src/drundel');

chai.use(dirtyChai);

describe('Action', () => {
  let action1;
  let action2;

  beforeEach(() => {
    action1 = drundel({
      triggers: { event1: { I: 1, P: 1 } },
    });

    action2 = drundel({
      props: { probability: 0.5, multiplier: 2 },
      events: { event1: 'probability = probability * multiplier' },
    });
  });

  afterEach(() => {
    eventbus.removeAllListeners();
    action1.clean();
    action2.clean();
  });

  it('should be correctly initialized', () => {
    expect(action1).to.exist();
    expect(action2).to.exist();
    expect(action2).to.have.property('multiplier');
    expect(action2).to.have.property('probability', 0.5);
  });

  it('should update probability', done => {
    setTimeout(() => {
      expect(action2.probability).to.be.above(0.5);
      done();
    }, 2);
  });
});
