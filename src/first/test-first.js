const expect = require('chai').expect;
const foo = require('./first').foo;

describe('first', () => {
  it('first', () => {
    expect(foo(1)).to.equal(10);
  });

  it('second', () => {
    expect(foo(2)).to.equal(20);
  });
});
