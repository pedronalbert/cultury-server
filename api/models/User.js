/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
'use strict';
let Promise = require('bluebird');
let bcrypt = require('bcrypt');

let EntityNotFoundError = require('../errors/EntityNotFoundError');

module.exports = {
  tableName: 'users',

  attributes: {
    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    role: {
      type: 'string'
    }
  },

  validationMessages: {
    firstName: {
      required: 'El nombre es obligatorio'
    },

    lastName: {
      required: 'El apellido es obligatorio'
    },

    email: {
      required: 'El correo es obligatorio',
      unique: 'Ya existe un usuario con este correo'
    },

    password: {
      required: 'La contraseña es obligatoria'
    }
  },

  beforeCreate (entity, cb) {
    entity.password = bcrypt.hashSync(entity.password, 10);

    return cb();
  },

  beforeUpdate (values, cb) {
    if (_.has(values, 'password')) {
      values.password = bcrypt.hashSync(values.password, 10);
    }

    return cb();
  }
};

