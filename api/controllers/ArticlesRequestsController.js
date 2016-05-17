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
      category: req.param('category')
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
    let updateData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.update(updateData);
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
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  publishAction (req, res) {
    let articleId = req.params.articleId;
    let articleData = {
      title: req.param('title'),
      content: req.param('content'),
      imageUrl: req.param('imageUrl'),
      category: req.param('category')
    };

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.publish(articleData);
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
    let articleId = req.params.articleId;
    let reason = req.param('reason');

    ArticlesRequestsRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.destroy();
      })
      .then(articleRequest => {
        return res.json({message: 'Articulo Negado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err.message))
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};