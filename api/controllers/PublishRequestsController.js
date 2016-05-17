'use strict';

let PublishRequestRepository = require('../repositories/PublishRequestRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    PublishRequestRepository
      .find()
      .then(publishRequests => res.json(publishRequests));
  },

  create (req, res) {
    let createData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    PublishRequestRepository
      .create(createData)
      .then(publishRequestCreated => {
        return res.json(publishRequestCreated);
      })
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  show (req, res) {
    let publishRequestId = req.params.publishRequestId;

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        return res.json(publishRequestFound);
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  update (req, res) {
    let publishRequestId = req.params.publishRequestId;
    let updateData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        return publishRequestFound.update(updateData);
      })
      .then(publishRequestUpdated => {
        return res.json(publishRequestUpdated);
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  publishAction (req, res) {
    let publishRequestId = req.params.publishRequestId;
    let articleData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    PublishRequestRepository
      .findOne({id: publishRequestId})
      .then(publishRequestFound => {
        return publishRequestFound.publish(articleData);
      })
      .then(articlePublished => {
        return res.json({
          message: 'Articulo Publicado',
          article: articlePublished
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
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
        return publishRequestFound.destroy();
      })
      .then(PublishRequest => {
        return res.json({message: 'Articulo Negado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};