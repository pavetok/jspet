'use strict';

const sinon = require('sinon');

const eventbus = require('../../src/eventbus/event-emitter');
const drundelator = require('../../src/domain/drundelator');

describe('Drundel', () => {
  const drundelFactory = drundelator();
  let drundel;
  let spec;
  let emptySpec;

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
    emptySpec = {
      props: {},
      calcs: {},
      events: {},
      subs: {},
      triggers: {},
    };
  });

  afterEach(() => {
    eventbus.cleanup();
    drundel && drundel.clean();
  });

  describe('should be correctly initialized', () => {
    let prototype;
    let emptyPrototype;

    beforeEach(() => {
      prototype = {
        props: {},
        calcs: {},
        events: {},
        subs: {},
        triggers: {},
      };
      emptyPrototype = {
        props: {},
        calcs: {},
        events: {},
        subs: {},
        triggers: {},
      };
    });

    it('without prototype and spec', () => {
      // when
      drundel = drundelFactory();
      // then
      drundel.should.exist;
      // and
      drundel.props.should.be.empty;
      drundel.calcs.should.be.empty;
      drundel.events.should.be.empty;
      drundel.subs.should.be.empty;
      drundel.triggers.should.be.empty;
    });

    it('with empty prototype and empty spec', () => {
      // when
      drundel = drundelator(emptyPrototype)(emptySpec);
      // then
      drundel.should.exist;
      // and
      drundel.props.should.be.empty;
      drundel.calcs.should.be.empty;
      drundel.events.should.be.empty;
      drundel.subs.should.be.empty;
      drundel.triggers.should.be.empty;
    });

    it('with empty prototype and non-empty spec', () => {
      // given
      spec.props.p1 = 1;
      spec.calcs.c1 = 'c1';
      spec.subs.s1 = 's1';
      spec.events.e1 = 'e1';
      spec.triggers.t1 = 't1';
      // when
      drundel = drundelator(emptyPrototype)(spec);
      // then
      drundel.props.should.contain(spec.props);
      drundel.calcs.should.contain(spec.calcs);
      drundel.subs.should.contain(spec.subs);
      drundel.events.should.contain(spec.events);
      drundel.triggers.should.contain(spec.triggers);
    });

    it('with non-empty prototype and empty spec', () => {
      // given
      prototype.props.p1 = 1;
      prototype.calcs.c1 = 'c1';
      prototype.subs.s1 = 's1';
      prototype.events.e1 = 'e1';
      prototype.triggers.t1 = 't1';
      // when
      drundel = drundelator(prototype)(emptySpec);
      // then
      drundel.props.should.have.property('p1', 1);
      drundel.calcs.c1.should.exist;
      drundel.calcs.should.have.property('c1', 'c1');
      drundel.subs.should.have.property('s1', 's1');
      drundel.events.should.have.property('e1', 'e1');
      drundel.triggers.should.have.property('t1', 't1');
    });

    it('with non-empty prototype and non-empty spec', () => {
      // given
      prototype.props.p1 = 1;
      prototype.props.p2 = 3;
      // and
      spec.props.p2 = 2;
      spec.props.p3 = 3;
      // when
      drundel = drundelator(prototype)(spec);
      // then
      drundel.props.should.have.property('p1', 1);
      drundel.props.should.have.property('p2', 2);
      drundel.props.should.have.property('p3', 3);
    });
  });

  it('should increment property after event', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['increment'] };
    // and
    drundel = drundelFactory(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    drundel.props.should.have.property('p', 3);
  });

  it('should double property after event', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['double'] };
    // and
    drundel = drundelFactory(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    drundel.props.should.have.property('p', 4);
  });

  it('can make multiple calculations', () => {
    // given
    spec.subs.s1 = { inputs: ['e1'], calcs: ['increment', 'double'] };
    // and
    drundel = drundelFactory(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    drundel.props.should.have.property('p', 6);
  });

  it('can use multiple properties', () => {
    // given
    spec.props.p1 = 2;
    spec.props.p2 = 3;
    spec.calcs.multiply = 'p1 = p1 * p2';
    spec.subs.s1 = { inputs: ['e1'], calcs: ['multiply'] };
    // and
    drundel = drundelFactory(spec);
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    drundel.props.should.have.property('p1', 6);
  });

  it('can make publication', () => {
    // given
    spec.events.e1 = { channel: 'ch1' };
    spec.events.e2 = { channel: 'ch2' };
    spec.subs.s1 = { inputs: ['e1'], outputs: ['e2'] };
    // and
    drundel = drundelFactory(spec);
    // and
    const publish = sinon.spy(drundel, 'publish');
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
    drundel = drundelFactory(spec);
    // and
    const publish = sinon.spy(drundel, 'publish');
    // when
    eventbus.publish(spec.events.e1.channel);
    // then
    drundel.props.should.have.property('p', 2);
    // and
    publish.should.have.been.calledWith('e2');
  });

  it('should correctly initialize triggers', done => {
    // given
    spec.triggers.t1 = { events: ['e1'], interval: 1, probability: 1 };
    // and
    eventbus.once(spec.events.e1.channel, done);
    // when
    drundel = drundelFactory(spec);
    // then
    // done() should be called
  });

  it('should not trigger zero probability event', done => {
    // given
    const interval = 1;
    const probability = 0;
    // and
    spec.triggers.t1 = { events: ['e1'], interval, probability };
    // and
    const publish = sinon.spy(eventbus, 'publish');
    // when
    drundel = drundelFactory(spec);
    // then
    setTimeout(() => {
      publish.should.not.have.been.called;
      done();
    }, interval + 1);
  });
});
