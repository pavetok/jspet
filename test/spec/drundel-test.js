'use strict';

const sinon = require('sinon');

const eventbus = require('../../src/eventbus/event-emitter');
const drundel = require('../../src/domain/drundel');

describe('Drundel', () => {
  let action;
  let spec;

  beforeEach(() => {
    spec = {
      props: {},
      calcs: {
        increment: 'p = p + 1',
        double: 'p = p * 2',
      },
      pubs: {},
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
    action.pubs.should.be.empty;
    action.subs.should.be.empty;
    action.triggers.should.be.empty;
  });

  it('should be initialized with empty spec', () => {
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
    spec.pubs.p1 = 'p1';
    spec.triggers.t1 = 't1';
    spec.subs.s1 = 's1';
    // when
    action = drundel(spec);
    // then
    action.should.contain(spec);
  });

  it('should increment property after event', () => {
    // given
    spec.props.p = 1;
    spec.subs.s1 = { channel: 'ch1', calcs: ['increment'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p', 2);
  });

  it('should double property after event', () => {
    // given
    spec.props.p = 2;
    spec.subs.s1 = { channel: 'ch1', calcs: ['double'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p', 4);
  });

  it('can make multiple calculations', () => {
    // given
    spec.props.p = 2;
    spec.subs.s1 = { channel: 'ch1', calcs: ['increment', 'double'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p', 6);
  });

  it('can use multiple properties', () => {
    // given
    spec.props.p1 = 2;
    spec.props.p2 = 3;
    spec.calcs.multiply = 'p1 = p1 * p2';
    spec.subs.s1 = { channel: 'ch1', calcs: ['multiply'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p1', 6);
  });

  it('can make publication', () => {
    // given
    spec.pubs.p1 = { channel: 'ch1', message: 'm1' };
    spec.subs.s1 = { channel: 'ch2', pubs: ['p1'] };
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish('ch2');
    // then
    publish.should.have.been.calledWith('p1');
  });

  it('can make calculations and publications', () => {
    // given
    spec.props.p = 1;
    spec.pubs.p1 = { channel: 'ch1', message: 'm1' };
    spec.subs.s1 = { channel: 'ch2', calcs: ['increment'], pubs: ['p1'] };
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish('ch2');
    // then
    action.props.should.have.property('p', 2);
    // and
    publish.should.have.been.calledWith('p1');
  });

  it('should correctly initialize triggers', done => {
    // given
    spec.pubs.p1 = { channel: 'ch1' };
    spec.triggers.t1 = { pubs: ['p1'], interval: 1, probability: 1 };
    // and
    eventbus.once('ch1', done);
    // when
    action = drundel(spec);
    // then
    // done() should be called
  });

  it('should not trigger zero probability event', done => {
    // given
    const interval = 1;
    spec.pubs.p1 = { channel: 'ch1' };
    spec.triggers.t1 = { pubs: ['p1'], interval, probability: 0 };
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
