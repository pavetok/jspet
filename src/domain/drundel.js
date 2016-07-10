'use strict';

const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');
const drundelModel = require('../model/mongoose/drundel');

const hrundel = Object.freeze({
  publish(event) {
    eventbus.publish(event.channel, event.message);
  },

  clean() {
    this.intervals.forEach(id => clearInterval(id));
  },
});

function drundel(spec) {
  const that = Object.create(hrundel);

  Object.assign(that, {
    props: spec && spec.props || {},
    pubs: spec && spec.pubs || {},
    subs: spec && spec.subs || {},
    triggers: spec && spec.triggers || {},
    intervals: [],
  });

  Object.keys(that.triggers).forEach(channel => {
    const trigger = that.triggers[channel];
    const probability = trigger.P || 0;
    const interval = trigger.I || 1000;
    const message = trigger.message;
    const intervalId = setInterval(() => {
      if (probability > Math.random()) {
        that.publish({ channel, message });
      }
    }, interval);
    that.intervals.push(intervalId);
  });

  Object.keys(that.subs).forEach(name => {
    const s = that.subs[name];
    eventbus.subscribe(s.channel, () => {
      s.ops.forEach(expression => math.compile(expression).eval(that));
      drundelModel.update(that);
    });
  });

  return that;
}

module.exports = drundel;
