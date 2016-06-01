'use strict';

module.exports = {
  tableName: 'publish_requests',

  attributes: {
    title: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      required: true
    },

    imageUrl: {
      type: 'string',
      required: true
    },

    category: {
      type: 'string',
      required: true
    },

    user: {
      model: 'user',
      required: true
    }
  },

  validationMessages: {
    title: {
      required: 'El título es obligatorio'
    },

    content: {
      required: 'El contenido es obligatorio'
    },

    imageUrl: {
      required: 'La imagen es obligatoria'
    },

    category: {
      required: 'La categoría es obligatoria'
    }
  }
};
