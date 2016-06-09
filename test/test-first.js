const expect = require('chai').expect;
const foo = require('../src/first').foo;

describe('test', () => {
  it('first', () => {
    expect(foo(1)).to.equal(10);
  });

  it('second', () => {
    expect(foo(2)).to.equal(20);
  });
});
