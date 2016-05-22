'use strict';

let PublishRequestRepository = require('../repositories/PublishRequestRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    PublishRequestRepository
      .find()
      .then(publishRequests => res.json(publishRequests))
      .catch(DatabaseError, err => res.serverError(err));
  },

  create (req, res) {
    let createData = req.body;
    createData.user = req.user.id;

    PublishRequestRepository
      .create(createData)
      .then(publishRequestCreated => {
        return res.created(publishRequestCreated);
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  show (req, res) {
    let publishRequestId = req.params.publishRequestId;

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        if (_.isUndefined(publishRequestFound)) {
          return res.notFound(new EntityNotFoundError('Peticion no encontrada'));
        }
        return res.json(publishRequestFound);
      })
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  update (req, res) {
    let publishRequestId = req.params.publishRequestId;
    let updateData = req.body;

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        if (_.isUndefined(publishRequestFound)) {
          return res.notFound(new EntityNotFoundError('Peticion no encontrada'));
        }

        if(publishRequestFound.user !== req.user.id) {
          return res.unauthorized('Este artículo no te pertenece');
        }

        return publishRequestFound.update(updateData);
      })
      .then(publishRequestUpdated => {
        return res.json(publishRequestUpdated);
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  publishAction (req, res) {
    let publishRequestId = req.params.publishRequestId;
    let articleData = req.body;

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        if (_.isUndefined(publishRequestFound)) {
          return res.notFound(new EntityNotFoundError('Peticion no encontrada'));
        }

        return publishRequestFound.publish(articleData);
      })
      .then(articlePublished => {
        return res.created(articlePublished);
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  /**
   *  @todo Send email with deny reason
   */
  denyAction (req, res) {
    let publishRequestId = req.params.publishRequestId;
    let reason = req.param('reason');

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        if (_.isUndefined(publishRequestFound)) {
          return res.notFound(new EntityNotFoundError('Peticion no encontrada'));
        }
        return publishRequestFound.destroy();
      })
      .then(PublishRequest => {
        return res.json({message: 'Articulo Negado'});
      })
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};