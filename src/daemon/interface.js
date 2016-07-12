'use strict';

/* eslint no-unused-vars: 0 */

/**
 * @interface
 */
const daemon = Object.seal({
  start() {
    throw new Error('Not implemented.');
  },

  stop() {
    throw new Error('Not implemented.');
  },
});

module.exports = daemon;
