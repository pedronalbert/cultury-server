'use strict';
let EditRequestRepository = require('../repositories/EditRequestRepository');
let DatabaseError = require('../errors/DatabaseError');
let ValidationError = require('../errors/ValidationError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');

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
    let data = _.pick(req.body, ['title', 'content', 'imageUrl', 'category', 'article']);
    data.user = req.user.id;

    EditRequestRepository
      .create(data)
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
      .find({id: editRequestId})
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
  }
}
