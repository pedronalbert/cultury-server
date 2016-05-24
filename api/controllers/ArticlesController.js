'use strict';

let ArticlesRepository = require('../repositories/ArticlesRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    ArticlesRepository
      .find()
      .then(articles => res.json({
        data: articles
      }))
      .catch(DatabaseError, err => res.serverError(err));
  },

  create (req, res) {
    let createData = req.body;

    ArticlesRepository
      .create(createData)
      .then(articleCreated => {
        return res.created({
          data: articleCreated
        }); 
      })
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  show (req, res) {
    let articleId = req.params.articleId;

    ArticlesRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return res.json(articleFound);
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
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

    ArticlesRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.update(newArticleData);
      })
      .then(articleUpdated => {
        return res.json(articleUpdated);
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  },

  destroy (req, res) {
    let articleId = req.params.articleId;

    ArticlesRepository
      .findOne({id: articleId})
      .then(articleFound => {
        return articleFound.destroy();
      })
      .then(articleDestroyed => {
        return res.json({message: 'Articulo eliminado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err.message));
  }
};