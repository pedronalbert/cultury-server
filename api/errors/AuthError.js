'use strict';
let ExtendableError = require('es6-error');

class AuthError extends ExtendableError {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

module.exports = AuthError;