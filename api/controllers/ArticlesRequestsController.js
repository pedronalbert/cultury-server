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
      content: req.param('content')
    };

    ArticlesRequestsRepository
      .create(newArticleData)
      .then(articleCreated => {
        return res.json(articleCreated);
      })
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
  }
};