/* @flow */

function foo(x) {
  const a = 10;
  return x * a;
}

function bar(x) {
  const b = 10;
  return x + b;
}

exports.foo = foo;
exports.bar = bar;
