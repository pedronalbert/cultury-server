'use strict';

module.exports = {
  tableName: 'articles_requests',

  attributes: {
    title: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string'
    }
  },

  validationMessages: {
    title: {
      required: 'El título es obligatorio'
    }
  }
};
