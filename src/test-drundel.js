const expect = require('chai').expect;
const drundel = require('./drundel').drundel;
const eventBus = require('./drundel').eventBus;

describe('Drundel', () => {
  it('correctly initialized', () => {
    const d = drundel({ a: 1 });
    expect(d).to.have.property('a', 1);
  });

  it('increments value on event', () => {
    // given
    const events = { a: 1, b: 2 };
    // and
    const d = drundel(events);
    // when
    eventBus.emit('a');
    // then
    expect(d).to.have.property('a', 2);
  });
});
