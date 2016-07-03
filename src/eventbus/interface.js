'use strict';

/**
 * @interface
 */
const eventbus = Object.seal({
  publish() {
    throw new Error('Not implemented.');
  },

  once() {
    throw new Error('Not implemented.');
  },

  subscribe() {
    throw new Error('Not implemented.');
  },

  cleanup() {
    throw new Error('Not implemented.');
  },
});

module.exports = eventbus;
