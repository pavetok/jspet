'use strict';

const EventEmitter = require('events');

const eventbusInterface = require('./eventbus');

/**
 * @implements {eventbus}
 */
function eventbusFactory() {
  const that = Object.create(eventbusInterface);
  const eventEmitter = new EventEmitter();

  Object.assign(that, {
    publish(eventName) {
      eventEmitter.emit(eventName);
    },

    once(eventName, listener) {
      eventEmitter.once(eventName, listener);
    },

    subscribe(eventName, listener) {
      eventEmitter.on(eventName, listener);
    },

    cleanup() {
      eventEmitter.removeAllListeners();
    },
  });

  return that;
}

const eventbus = eventbusFactory();

module.exports = eventbus;
