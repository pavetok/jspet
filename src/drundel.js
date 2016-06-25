const EventEmitter = require('events');

const eventBus = new EventEmitter();

function drundel(events) {
  /**
   * Принимает объект с ожидаемыми событиями и значениями.
   * При наступлении события инкрементирует значение.
   */
  const that = Object.create({});
  Object.assign(that, events);
  Object.keys(events).forEach(
    e => eventBus.on(e, () => that[e]++)
  );
  return that;
}

module.exports = { drundel, eventBus };
