'use strict';
let ExtendableError = require('es6-error');

class AuthError extends ExtendableError {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.message = message;
  }

  toJSON() {
    return {
      code: this.name,
      title: this.message
    }
  }
}

module.exports = AuthError;