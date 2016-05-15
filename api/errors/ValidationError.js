'use strict';
let ExtentendableError = require('es6-error');

class ValidationError extends ExtentendableError {
  constructor(message, attributes) {
    super(message);
    this.name = 'ValidationError';
    this.attributes = attributes || {};
  }

  addAttribute (inputName, message) {
    if (!_.has(this.attributes, inputName)) {
      this.attributes[inputName] = [];
    }

    this.attributes[inputName].push({message: message});
  }
}

module.exports = ValidationError;