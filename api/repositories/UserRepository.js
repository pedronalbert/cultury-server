'use strict';
let Promise = require('bluebird');
let bcrypt = require('bcrypt');
let ValidationError = require('../errors/ValidationError');
let UserEntity = require('../entities/UserEntity');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {

  find (criteria) {
    return new Promise((resolve, reject) => {
      User
        .find(criteria)
        .then(users => {
          let usersEntities = [];

          _.each(users, user => {
            usersEntities.push(new UserEntity(user));
          });

          return resolve(usersEntities);
        })
        .catch(err => {
          sails.log.error(err);

          return reject(new DatabaseError());
        });
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      User
        .findOne(criteria)
        .then(userFound => {
          if(_.isUndefined(userFound)) {
            return resolve(undefined);
          }

          return resolve(new UserEntity(userFound));
        })
        .catch(err => {
          sails.log.error(err);

          return reject(new DatabaseError());
        });
    })
  },

  create (newUserData) {
    return new Promise((resolve, reject) => {
      User
        .create(newUserData)
        .then(userCreated => resolve(new UserEntity(userCreated)))
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Usuario no ha podido ser registrado', err.Errors));
          }
          
          sails.log.error(err);
          return reject(new DatabaseError());
        });
    });
  }
}