'use strict';

const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');
const drundelModel = require('../model/mongoose/drundel');

const hrundel = Object.freeze({
  publish(channel, message) {
    eventbus.publish(channel, message);
  },

  clean() {
    this.intervals.forEach(id => clearInterval(id));
  },
});

function drundel(spec) {
  const that = Object.create(hrundel);

  Object.assign(that, {
    props: spec && spec.props || {},
    triggers: spec && spec.triggers || {},
    subscriptions: spec && spec.subscriptions || {},
    intervals: [],
  });

  Object.keys(that.triggers).forEach(channel => {
    const trigger = that.triggers[channel];
    const probability = trigger.P || 0;
    const interval = trigger.I || 1000;
    const intervalId = setInterval(() => {
      if (probability > Math.random()) {
        that.publish(channel, trigger.message);
      }
    }, interval);
    that.intervals.push(intervalId);
  });

  Object.keys(that.subscriptions).forEach(channel =>
    eventbus.subscribe(channel, () => {
      const data = that.subscriptions[channel];
      const expressions = typeof data === 'string' ? [data] : data;
      expressions.forEach(expression => math.compile(expression).eval(that.props));
      drundelModel.update(that);
    })
  );

  return that;
}

module.exports = drundel;
