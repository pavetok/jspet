'use strict';


const math = require('mathjs');

const eventbus = require('../eventbus/event-emitter');

function drundelator(prototype) {
  const hrundel = prototype || {};

  Object.assign(hrundel, {
    props: hrundel.props || {},
    calcs: hrundel.calcs || {},
    events: hrundel.events || {},
    subs: hrundel.subs || {},
    triggers: hrundel.triggers || {},

    publish(name) {
      const event = this.events[name];
      eventbus.publish(event.channel, event.message);
    },

    clean() {
      this.intervals.forEach(clearInterval);
    },
  });

  return function drundelFactory(spec) {
    const that = Object.create(hrundel);
    Object.assign(that, {
      _id: spec && spec._id,
      props: Object.assign(Object.create(hrundel.props), spec && spec.props),
      calcs: Object.assign(Object.create(hrundel.calcs), spec && spec.calcs),
      events: Object.assign(Object.create(hrundel.events), spec && spec.events),
      subs: Object.assign(Object.create(hrundel.subs), spec && spec.subs),
      triggers: Object.assign(Object.create(hrundel.triggers), spec && spec.triggers),
      intervals: [],
    });

    Object.keys(that.triggers).forEach(triggerName => {
      const trigger = that.triggers[triggerName];
      const events = trigger.events || [];
      const probability = trigger.probability || 0;
      const interval = trigger.interval || 1000;
      const intervalId = setInterval(() => {
        if (probability > Math.random()) {
          events.forEach(eventName => that.publish(eventName));
        }
      }, interval);
      that.intervals.push(intervalId);
    });

    Object.keys(that.subs).forEach(subName => {
      const sub = that.subs[subName];
      const calcs = sub.calcs || [];
      const inputs = sub.inputs || [];
      const outputs = sub.outputs || [];
      inputs.forEach(inputEvent => {
        eventbus.subscribe(that.events[inputEvent].channel, () => {
          calcs.forEach(calcName => math.compile(that.calcs[calcName]).eval(that.props));
          outputs.forEach(outputEvent => that.publish(outputEvent));
        });
      });
    });

    return that;
  };
}

module.exports = drundelator;
