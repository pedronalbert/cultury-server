'use strict';

module.exports = {
  tableName: 'articles',

  attributes: {
    title: {
      type: 'string',
      required: true,
      unique: true
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
      model: 'user'
    }
  },

  validationMessages: {
    title: {
      required: 'El título es obligatorio',
      unique: 'Ya existe un artículo con este título'
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
