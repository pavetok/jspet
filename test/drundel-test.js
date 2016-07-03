'use strict';

const sinon = require('sinon');

const eventbus = require('../src/eventbus/event-emitter');
const drundel = require('../src/domain/drundel');

describe('Drundel', () => {
  let action;
  let spec;

  beforeEach(() => {
    spec = {
      props: {},
      triggers: {},
      events: {},
    };
  });

  afterEach(() => {
    eventbus.cleanup();
    action.clean();
  });

  it('should be initialized without spec', () => {
    // when
    action = drundel();
    // then
    action.should.exist;
  });

  it('should be initialized with empty spec', () => {
    // when
    action = drundel(spec);
    // then
    action.should.exist;
  });

  it('should be correctly initialized', () => {
    // given
    spec.props.p = 1;
    spec.events.e = 'e';
    // when
    action = drundel(spec);
    // then
    action.should.have.property('p', 1);
    action.should.not.have.property('e');
  });

  it('should increment value after event', () => {
    // given
    spec.props.p = 1;
    spec.events.e = 'p = p + 1';
    // and
    action = drundel(spec);
    // when
    eventbus.publish('e');
    // then
    action.should.have.property('p', 2);
  });

  it('should double value after event', () => {
    // given
    spec.props.p = 2;
    spec.events.e = 'p = p * 2';
    // and
    action = drundel(spec);
    // when
    eventbus.publish('e');
    // then
    action.should.have.property('p', 4);
  });

  it('can handle multiple expressions', () => {
    // given
    spec.props.p = 2;
    spec.events.e = ['p = p + 1', 'p = p * 2'];
    // and
    action = drundel(spec);
    // when
    eventbus.publish('e');
    // then
    action.should.have.property('p', 6);
  });

  it('can use multiple properties', () => {
    // given
    spec.props.p1 = 2;
    spec.props.p2 = 3;
    spec.events.e = 'p1 = p1 * p2';
    // and
    action = drundel(spec);
    // when
    eventbus.publish('e');
    // then
    action.should.have.property('p1', 6);
  });

  it('can publish event', () => {
    // given
    spec.props.a = 'a1';
    spec.events.e = 'publish(a)';
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish('e');
    // then
    publish.should.have.been.calledWith(spec.props.a);
  });

  it('should correctly initialize triggers', done => {
    // given
    spec.triggers = { event1: { I: 1, P: 1 } };
    // and
    eventbus.once('event1', done);
    // when
    action = drundel(spec);
    // then
    // done() should be called
  });

  it('should not trigger zero probability event', done => {
    // given
    const interval = 1;
    // and
    spec.triggers = { event1: { I: 1, P: 0 } };
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
