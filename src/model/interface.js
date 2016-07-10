'use strict';

/* eslint no-unused-vars: 0 */

/**
 * @interface
 */
const model = Object.seal({
  create(doc) {
    throw new Error('Not implemented.');
  },

  update(doc) {
    throw new Error('Not implemented.');
  },

  remove(doc) {
    throw new Error('Not implemented.');
  },

  removeAll() {
    throw new Error('Not implemented.');
  },

  findById(id) {
    throw new Error('Not implemented.');
  },

  findOne(query) {
    throw new Error('Not implemented.');
  },

  find(query) {
    throw new Error('Not implemented.');
  },

  findAll() {
    throw new Error('Not implemented.');
  },
});

module.exports = model;
