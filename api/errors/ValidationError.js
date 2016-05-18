'use strict';
let ExtentendableError = require('es6-error');

class ValidationError extends ExtentendableError {
  constructor(message, attributes) {
    super(message);
    this.name = 'ValidationError';
    this.attributes = attributes;
  }

  toJSON () {
    let json = {
      code: this.name,
      title: this.message,
      detail: {
        attributes: {}
      }
    };

    _.each(this.attributes, (errors, attributeName) => {
      if (_.isArray(errors)) {
        json.detail.attributes[attributeName] = errors[0].message;
      } else {
        json.detail.attributes[attributeName] = errors;
      }
    });

    return json;
  }
}

module.exports = ValidationError;