const expect = require('chai').expect;
const drundel = require('./drundel');

describe('Drundel', () => {
  it('correctly initialized', () => {
    const d = drundel({ a: 1 });
    expect(d).to.have.property('a');
  });
});
