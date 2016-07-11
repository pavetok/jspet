'use strict';

/* eslint no-unused-vars: 0 */

/**
 * @interface
 */
const eventbus = Object.seal({
  publish(channel, message) {
    throw new Error('Not implemented.');
  },

  once(channel, handler) {
    throw new Error('Not implemented.');
  },

  subscribe(channel, handler) {
    throw new Error('Not implemented.');
  },

  cleanup() {
    throw new Error('Not implemented.');
  },
});

module.exports = eventbus;
