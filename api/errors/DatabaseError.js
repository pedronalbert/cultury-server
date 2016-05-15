'use strict';
let ExtentendableError = require('es6-error');

class DatabaseError extends ExtentendableError {
  constructor(message, attributes) {
    super(message);
    this.name = 'DatabaseError';
  }
}

module.exports = DatabaseError;