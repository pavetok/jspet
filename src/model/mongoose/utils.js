'use strict';

module.exports = {
  getOrCreate(connection, name, schema) {
    try {
      return connection.model(name);
    } catch (error) {
      return connection.model(name, schema);
    }
  },
};
