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
      .catch(DatabaseError, err => res.serverError(err));
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
      .catch(DatabaseError, err => res.serverError(err))
      .catch(ValidationError, err => res.badRequest(err)); 
  },

  show (req, res) {
    let userId = req.params.id;

    UserRepository
      .findOne(userId)
      .then(userFound => {
        if (_.isUndefined(userFound)) {
          throw new EntityNotFoundError('Usuario no encontrado');
        }

        return res.json({
          data: userFound
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  update (req, res) {
    let userId = req.params.id;
    let updateData = _.pick(
      req.body,
      ['firstName', 'lastName', 'email']
    );

    UserRepository
      .findOne({id: userId})
      .then(userFound => {
        if (_.isUndefined(userFound)) {
          throw new EntityNotFoundError('Usuario no encontrado');
        }
        return userFound.update(updateData);
      })
      .then(userUpdated => {
        return res.json({
          data: userUpdated
        });
      })
      .catch(DatabaseError, err => res.serverError(err))
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err));
  },

  changePassword (req, res) {
    let userId = req.params.id;
    let oldPassword = req.param('oldPassword');
    let newPassword = req.param('newPassword');

    UserRepository
      .findOne({id: userId})
      .then(userFound => {
        if (_.isUndefined(userFound)) {
          throw new EntityNotFoundError('Usuario no encontrado');
        }
        return userFound.changePassword(oldPassword, newPassword);
      })
      .then(userUpdated => {
        return res.json({message: 'Contraseña actualizada exitosamente'});
      })
      .catch(DatabaseError, err => res.serverError(err))
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err));
  }
};

