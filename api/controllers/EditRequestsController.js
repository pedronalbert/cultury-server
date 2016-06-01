'use strict';
let EditRequestRepository = require('../repositories/EditRequestRepository');
let DatabaseError = require('../errors/DatabaseError');
let ValidationError = require('../errors/ValidationError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let AuthError = require('../errors/AuthError');

module.exports = {
  index (req, res) {
    EditRequestRepository
      .find()
      .then(editRequests => {
        return res.json({
          data: editRequests
        })
      })
      .catch(DatabaseError, err => res.serverError(err));
  },

  create (req, res) {
    let createData = _.pick(req.body, ['title', 'content', 'imageUrl', 'category', 'article']);
    createData.user = req.user.id;

    EditRequestRepository
      .create(createData)
      .then(editRequestCreated => {
        return res.created({
          data: editRequestCreated
        })
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  show (req, res) {
    let editRequestId = req.params.editRequestId;

    EditRequestRepository
      .findOne({id: editRequestId})
      .then(editRequestFound => {
        if (_.isEmpty(editRequestFound)) {
          throw new EntityNotFoundError('Peticion no encontrada');
        }

        return res.json({
          data: editRequestFound
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  update (req, res) {
    let editRequestId = req.params.editRequestId;
    let updateData = _.pick(req.body, ['title', 'content', 'imageUrl', 'category']);

    EditRequestRepository
      .findOne({id: editRequestId})
      .then(editRequestFound => {
        if (_.isEmpty(editRequestFound)) {
          throw new EntityNotFoundError('Peticion no encontrada');
        }

        if (req.user.id !== editRequestFound.user) {
          throw new AuthError('No tiene los permisos necesarios');
        }

        return editRequestFound.update(updateData);
      })
      .then(editRequestUpdated => {
        return res.json({
          data: editRequestUpdated
        })
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(AuthError, err => res.unauthorized(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  }
}
