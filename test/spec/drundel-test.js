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
    action.triggers.should.be.empty;
    action.subs.should.be.empty;
  });

  it('should be initialized with empty spec', () => {
    // when
    action = drundel(spec);
    // then
    action.should.exist;
    // and
    action.props.should.be.empty;
    action.triggers.should.be.empty;
    action.subs.should.be.empty;
  });

  it('should be correctly initialized', () => {
    // given
    spec.props.p = 1;
    spec.triggers.ch2 = 'ch2';
    spec.subs.ch1 = 'ch1';
    // when
    action = drundel(spec);
    // then
    action.props.should.contain(spec.props);
    action.triggers.should.contain(spec.triggers);
    action.subs.should.contain(spec.subs);
  });

  it('should increment value after event', () => {
    // given
    spec.props.p = 1;
    spec.subs.s1 = { channel: 'ch1', ops: ['props.p = props.p + 1'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p', 2);
  });

  it('should double value after event', () => {
    // given
    spec.props.p = 2;
    spec.subs.s1 = { channel: 'ch1', ops: ['props.p = props.p * 2'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p', 4);
  });

  it('can handle multiple expressions', () => {
    // given
    spec.props.p = 2;
    spec.subs.s1 = { channel: 'ch1', ops: [
      'props.p = props.p + 1',
      'props.p = props.p * 2',
    ] };
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
    spec.subs.s1 = { channel: 'ch1', ops: ['props.p1 = props.p1 * props.p2'] };
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p1', 6);
  });

  it('can publish event', () => {
    // given
    spec.pubs.p1 = { channel: 'ch1', message: 'm1' };
    spec.subs.s1 = { channel: 'ch2', ops: ['publish(pubs.p1)'] };
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish('ch2');
    // then
    publish.should.have.been.calledWith(spec.pubs.p1);
  });

  it('should correctly initialize triggers', done => {
    // given
    spec.triggers.ch1 = { I: 1, P: 1 };
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
    // and
    spec.triggers.ch1 = { I: 1, P: 0 };
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
