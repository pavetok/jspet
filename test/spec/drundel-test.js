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
      triggers: {},
      subscriptions: {},
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
    action.subscriptions.should.be.empty;
  });

  it('should be initialized with empty spec', () => {
    // when
    action = drundel(spec);
    // then
    action.should.exist;
    // and
    action.props.should.be.empty;
    action.triggers.should.be.empty;
    action.subscriptions.should.be.empty;
  });

  it('should be correctly initialized', () => {
    // given
    spec.props.p = 1;
    spec.triggers.ch2 = 'ch2';
    spec.subscriptions.ch1 = 'ch1';
    // when
    action = drundel(spec);
    // then
    action.props.should.contain(spec.props);
    action.triggers.should.contain(spec.triggers);
    action.subscriptions.should.contain(spec.subscriptions);
  });

  it('should increment value after event', () => {
    // given
    spec.props.p = 1;
    spec.subscriptions.ch1 = 'p = p + 1';
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
    spec.subscriptions.ch1 = 'p = p * 2';
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
    spec.subscriptions.ch1 = ['p = p + 1', 'p = p * 2'];
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
    spec.subscriptions.ch1 = 'p1 = p1 * p2';
    // and
    action = drundel(spec);
    // when
    eventbus.publish('ch1');
    // then
    action.props.should.have.property('p1', 6);
  });

  it('can publish event', () => {
    // given
    spec.events.ch1 = 'message';
    spec.subscriptions.ch2 = 'publish(ch1)';
    // and
    action = drundel(spec);
    // and
    const publish = sinon.spy(action, 'publish');
    // when
    eventbus.publish('ch2');
    // then
    publish.should.have.been.calledWith('ch1', 'message');
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
