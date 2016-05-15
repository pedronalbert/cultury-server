'use strict';
let ExtentendableError = require('es6-error');

class EntityNotFoundError extends ExtentendableError {
  constructor(message, attributes) {
    super(message);
    this.name = 'EntityNotFoundError';
  }
}

module.exports = EntityNotFoundError;