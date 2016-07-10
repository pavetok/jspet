'use strict';

const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');

const hrundel = Object.freeze({
  publish(name) {
    const pub = this.pubs[name];
    eventbus.publish(pub.channel, pub.message);
  },

  clean() {
    this.intervals.forEach(id => clearInterval(id));
  },
});

function drundel(spec) {
  const that = Object.create(hrundel);

  Object.assign(that, {
    props: spec && spec.props || {},
    calcs: spec && spec.calcs || {},
    pubs: spec && spec.pubs || {},
    subs: spec && spec.subs || {},
    triggers: spec && spec.triggers || {},
    intervals: [],
  });

  Object.keys(that.triggers).forEach(triggerName => {
    const trigger = that.triggers[triggerName];
    const pubs = trigger.pubs;
    const probability = trigger.probability || 0;
    const interval = trigger.interval || 1000;
    const intervalId = setInterval(() => {
      if (probability > Math.random()) {
        pubs.forEach(pubName => that.publish(pubName));
      }
    }, interval);
    that.intervals.push(intervalId);
  });

  Object.keys(that.subs).forEach(subName => {
    const subscription = that.subs[subName];
    const calcs = subscription.calcs || [];
    const pubs = subscription.pubs || [];
    eventbus.subscribe(subscription.channel, () => {
      calcs.forEach(calcName => math.compile(that.calcs[calcName]).eval(that.props));
      pubs.forEach(pubName => that.publish(pubName));
    });
  });

  return that;
}

module.exports = drundel;
