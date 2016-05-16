'use strict';

let ArticlesRequestsRepository = require('../repositories/ArticlesRequestsRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    ArticlesRequestsRepository
      .find()
      .then(articles => res.json(articles));
  },

  create (req, res) {
    let newArticleData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category'),
      state: 'waiting'
    };

    ArticlesRequestsRepository
      .create(newArticleData)
      .then(articleCreated => {
        return res.json(articleCreated);
      })
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  show (req, res) {
    let articleId = req.params.articleId;

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return res.json(articleFound);
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  update (req, res) {
    let articleId = req.params.articleId;
    let newArticleData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.update(newArticleData);
      })
      .then(articleUpdated => {
        return res.json(articleUpdated);
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  destroy (req, res) {
    let articleId = req.params.articleId;

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.destroy();
      })
      .then(articleDestroyed => {
        return res.json({message: 'Articulo eliminado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  publishAction (req, res) {
    let articleId = req.params.articleId;

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.publish();
      })
      .then(newArticle => {
        return res.json({
          message: 'Articulo Publicado',
          articulo: newArticle
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  denyAction (req, res) {
    let articleId = req.params.articleId;

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.deny();
      })
      .then(articleRequest => {
        return res.json({message: 'Articulo Denegado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(ValidationError, err => res.validationError(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};