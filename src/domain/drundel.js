'use strict';

const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');

const hrundel = Object.freeze({
  publish(eventName) {
    // console.log('eventName: %s, P: %s, I: %s', eventName, trigger.P, trigger.I);
    eventbus.publish(eventName);
  },
});

function drundel(spec) {
  const that = Object.create(hrundel);
  const props = spec && spec.props || {};
  const triggers = spec && spec.triggers || {};
  const events = spec && spec.events || {};

  Object.assign(that, props);

  const intervals = [];
  Object.keys(triggers).forEach(eventName => {
    const trigger = triggers[eventName];
    const probability = trigger.P || 0;
    const interval = trigger.I || 1000;
    const intervalId = setInterval(() => {
      if (probability > Math.random()) {
        that.publish(eventName);
      }
    }, interval);
    intervals.push(intervalId);
  });

  Object.keys(events).forEach(
    eventName => eventbus.subscribe(eventName, () => {
      const data = events[eventName];
      const expressions = typeof data === 'string' ? [data] : data;
      expressions.forEach(expression => math.compile(expression).eval(that));
    })
  );

  Object.assign(that, {
    clean() {
      intervals.forEach(id => clearInterval(id));
    },
  });

  return that;
}

module.exports = drundel;
