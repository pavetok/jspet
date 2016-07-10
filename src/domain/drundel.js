'use strict';

const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');
const drundelModel = require('../model/mongoose/drundel');

const hrundel = Object.freeze({
  publish(channel, message) {
    eventbus.publish(channel, message);
  },
});

function drundel(spec) {
  const that = Object.create(hrundel);
  const props = spec && spec.props || {};
  const triggers = spec && spec.triggers || {};
  const channels = spec && spec.channels || {};

  Object.assign(that, props);

  const intervals = [];
  Object.keys(triggers).forEach(channel => {
    const trigger = triggers[channel];
    const probability = trigger.P || 0;
    const interval = trigger.I || 1000;
    const intervalId = setInterval(() => {
      if (probability > Math.random()) {
        that.publish(channel, trigger.message);
      }
    }, interval);
    intervals.push(intervalId);
  });

  Object.keys(channels).forEach(channel =>
    eventbus.subscribe(channel, () => {
      const data = channels[channel];
      const expressions = typeof data === 'string' ? [data] : data;
      expressions.forEach(expression => math.compile(expression).eval(that));
      drundelModel.update(that);
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
