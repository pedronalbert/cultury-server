'use strict';

let ArticlesEditRequestsRepository = require('../repositories/ArticlesEditRequestsRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    ArticlesEditRequestsRepository
      .find()
      .then(articles => res.json(articles));
  },

  create (req, res) {
    let editRequestData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category'),
      article: req.param('article')
    };

    ArticlesEditRequestsRepository
      .create(editRequestData)
      .then(editRequest => {
        return res.json(editRequest);
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  update (req, res) {
    let editRequestId = req.params.editRequestId;
    let editRequestData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    ArticlesEditRequestsRepository
      .findOne({id: editRequestId})
      .then(editRequest => {
        return editRequest.update(editRequestData);
      })
      .then(editRequestUpdated => {
        return res.json(editRequestUpdated);
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  publishAction (req, res) {
    let editRequestId = req.params.editRequestId;
    let editRequestData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    ArticlesEditRequestsRepository
      .findOne({id: editRequestId})
      .then(editRequest => {
        return editRequest.publish(editRequestData);
      })
      .then(articleUpdated => {
        return res.json(articleUpdated);
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  /**
   * @todo send email with deny reason
   */

  denyAction (req, res) {
    let editRequestId = req.params.editRequestId;

    ArticlesEditRequestsRepository
      .findOne({id: editRequestId})
      .then(editRequest => {
        return editRequest.destroy();
      })
      .then(() => {
        return res.json({message: 'Petición Negada'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};