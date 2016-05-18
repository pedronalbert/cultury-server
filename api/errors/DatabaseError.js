'use strict';
let ExtentendableError = require('es6-error');

class DatabaseError extends ExtentendableError {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.message = message || 'Error en el servidor, intente más tarde';
  }

  toJSON () {
    return {
      code: this.name,
      title: this.message
    }
  }
}

module.exports = DatabaseError;