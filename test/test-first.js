import { expect } from 'chai';
import { foo } from '../src/first';

describe('test', () => {
  it('first', () => {
    expect(foo(1)).to.equal(10);
  });

  it('second', () => {
    expect(foo(2)).to.equal(20);
  });
});
