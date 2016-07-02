'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const eventbus = require('./eventbus');
const drundel = require('./drundel');

chai.use(sinonChai);
chai.use(dirtyChai);

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
    eventbus.removeAllListeners();
    action.clean();
  });

  it('should be initialized without spec', () => {
    // when
    action = drundel();
    // then
    expect(action).to.exist();
  });

  it('should be initialized with empty spec', () => {
    // when
    action = drundel(spec);
    // then
    expect(action).to.exist();
  });

  it('should be correctly initialized', () => {
    // given
    spec.props.p = 1;
    spec.events.e = 'e';
    // when
    action = drundel(spec);
    // then
    expect(action).to.have.property('p', 1);
    expect(action).to.not.have.property('e');
  });

  it('should increment value after event', () => {
    // given
    spec.props.p = 1;
    spec.events.e = 'p = p + 1';
    // and
    action = drundel(spec);
    // when
    eventbus.emit('e');
    // then
    expect(action).to.have.property('p', 2);
  });

  it('should double value after event', () => {
    // given
    spec.props.p = 2;
    spec.events.e = 'p = p * 2';
    // and
    action = drundel(spec);
    // when
    eventbus.emit('e');
    // then
    expect(action).to.have.property('p', 4);
  });

  it('can handle multiple expressions', () => {
    // given
    spec.props.p = 2;
    spec.events.e = ['p = p + 1', 'p = p * 2'];
    // and
    action = drundel(spec);
    // when
    eventbus.emit('e');
    // then
    expect(action).to.have.property('p', 6);
  });

  it('can use multiple properties', () => {
    // given
    spec.props.p1 = 2;
    spec.props.p2 = 3;
    spec.events.e = 'p1 = p1 * p2';
    // and
    action = drundel(spec);
    // when
    eventbus.emit('e');
    // then
    expect(action).to.have.property('p1', 6);
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
    eventbus.emit('e');
    // then
    expect(publish).to.have.been.calledWith(spec.props.a);
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
    const emit = sinon.spy(eventbus, 'emit');
    // when
    action = drundel(spec);
    // then
    setTimeout(() => {
      expect(emit).to.not.have.been.called();
      done();
    }, interval + 1);
  });
});
