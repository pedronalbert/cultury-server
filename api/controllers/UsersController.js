/**
 * UsersControllerController
 *
 * @description :: Server-side logic for managing Userscontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let UserRepository = require('../repositories/UserRepository');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    UserRepository
      .find()
      .then(users => {
        return res.json({
          data: users
        });
      })
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  create (req, res) {
    let createData = req.body;

    UserRepository
      .create(createData)
      .then(userCreated => {
        return res.created({
          data: userCreated
        });
      })
      .catch(DatabaseError, err => res.serverError(err.message))
      .catch(ValidationError, err => {
        return res.validationError(err);
      });
  },

  show (req, res) {
    let userId = req.params.id;

    UserRepository
      .findOne(userId)
      .then(userFound => {
        return res.json({
          data: userFound
        });
      })
      .catch(DatabaseError, err => res.serverError(err.message))
      .catch(EntityNotFoundError, err => res.notFound(err.message));
  },

  update (req, res) {
    let userId = req.params.id;
    let newUserData = {
      firstName: req.param('firstName'),
      lastName: req.param('lastName'),
      email: req.param('email')
    };

    UserRepository
      .findOne({id: userId})
      .then(userFound => {
        return userFound.update(newUserData);
      })
      .then(userUpdated => {
        return res.json(userUpdated);
      })
      .catch(DatabaseError, err => res.serverError(err.message))
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err));
  },

  changePassword (req, res) {
    let userId = req.params.id;
    let oldPassword = req.param('oldPassword');
    let newPassword = req.param('newPassword');

    UserRepository
      .findOne({id: userId})
      .then(userFound => {
        return userFound.changePassword(oldPassword, newPassword);
      })
      .then(userUpdated => {
        return res.json({message: 'Contraseña actualizada exitosamente'});
      })
      .catch(DatabaseError, err => res.serverError(err.message))
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err));
  }
};

