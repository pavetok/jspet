'use strict';

/**
 * @interface
 */
const model = Object.seal({
  create() {
    throw new Error('Not implemented.');
  },

  findOne() {
    throw new Error('Not implemented.');
  },

  findById() {
    throw new Error('Not implemented.');
  },

  find() {
    throw new Error('Not implemented.');
  },

  findAll() {
    throw new Error('Not implemented.');
  },
});

module.exports = model;
