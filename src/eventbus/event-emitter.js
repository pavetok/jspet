'use strict';

const EventEmitter = require('events');

const eventbusInterface = require('./interface');

/**
 * @implements {eventbus}
 */
function eventbusFactory() {
  const that = Object.create(eventbusInterface);
  const eventEmitter = new EventEmitter();

  Object.assign(that, {
    publish(channel, message) {
      eventEmitter.emit(channel, message);
    },

    once(channel, handler) {
      eventEmitter.once(channel, handler);
    },

    subscribe(channel, handler) {
      eventEmitter.on(channel, handler);
    },

    cleanup() {
      eventEmitter.removeAllListeners();
    },
  });

  return that;
}

const eventbus = eventbusFactory();

module.exports = eventbus;
