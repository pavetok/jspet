'use strict';

const sinon = require('sinon');

const eventbus = require('../../src/eventbus/event-emitter');
const drundel = require('../../src/domain/drundel');

describe('Drundel', () => {
  let action;
  let spec;

  beforeEach(() => {
    spec = {
      props: { p: 2 },
      calcs: {
        increment: 'p = p + 1',
        double: 'p = p * 2',
      },
      events: {
        e1: { channel: 'ch1' },
      },
      subs: {},
      triggers: {},
    };
  });

  afterEach(() => {
    eventbus.cleanup();
    action && action.clean();
  });

  it('should be initialized without spec', () => {
    // when
    action = drundel();
    // then
    action.should.exist;
    // and
    action.props.should.be.empty;
    action.calcs.should.be.empty;
    action.events.should.be.empty;
    action.subs.should.be.empty;
    action.triggers.should.be.empty;
  });

  it('should be initialized with empty spec', () => {
    // given
    spec.props = {};
    spec.calcs = {};
    spec.subs = {};
    spec.events = {};
    spec.triggers = {};
    // when
    action = drundel(spec);
    // then
    action.should.exist;
    // and
    action.should.contain(spec);
  });

  it('should be correctly initialized', () => {
    // given
    spec.props.p1 = 1;
    spec.calcs.c1 = 'c1';
    spec.subs.s1 = 's1';
    spec.events.e1 = 'e1';
    spec.triggers.t1 = 't1';
    // when
    action = drundel(spec);
    // then
    action.should.contain(spec);
  });

  it('should increment property after event', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['increment'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    action.props.should.have.property('p', 3);
  });

  it('should double property after event', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['double'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    action.props.should.have.property('p', 4);
  });

  it('can make multiple calculations', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['increment', 'double'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    action.props.should.have.property('p', 6);
  });

  it('can use multiple properties', () => {
    // given
    spec.props.p1 = 2;
    spec.props.p2 = 3;
    spec.calcs.multiply = 'p1 = p1 * p2';
    spec.subs.s1 = { inputs: ['e1'], calcs: ['multiply'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    action.props.should.have.property('p1', 6);
  });

  it('can make publication', () => {
    // given
    spec.events.e1 = { channel: 'ch1' };
    spec.events.e2 = { channel: 'ch2' };
    spec.subs.s1 = { inputs: ['e1'], outputs: ['e2'] };
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    publish.should.have.been.calledWith('e2');
  });

  it('can make calculations and publications', () => {
    // given
    spec.props.p = 1;
    spec.events.e1 = { channel: 'ch1' };
    spec.events.e2 = { channel: 'ch2' };
    spec.subs.s1 = { inputs: ['e1'], calcs: ['increment'], outputs: ['e2'] };
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    action.props.should.have.property('p', 2);
    // and
    publish.should.have.been.calledWith('e2');
  });

  it('should correctly initialize triggers', done => {
    // given
    spec.triggers.t1 = { events: ['e1'], interval: 1, probability: 1 };
    // and
    eventbus.once(spec.events.e1.channel, done);
    // when
    action = drundel(spec);
    // then
    // done() should be called
  });

  it('should not trigger zero probability event', done => {
    // given
    const interval = 1;
    spec.triggers.t1 = { events: ['e1'], interval, probability: 0 };
    // and
    const publish = sinon.spy(eventbus, 'publish');
    // when
    action = drundel(spec);
    // then
    setTimeout(() => {
      publish.should.not.have.been.called;
      done();
    }, interval + 1);
  });
});
