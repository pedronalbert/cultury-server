'use strict';

let ArticlesRepository = require('../repositories/ArticlesRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    let pagination = {
      page_number: parseInt(req.param('page_number', 1)),
      page_size: parseInt(req.param('page_size', 20))
    };

    ArticlesRepository
      .paginate({}, pagination)
      .then(data => {
        return res.json({
          data: data.articles,
          meta: data.pagination
        });
      })
      .catch(DatabaseError, err => res.serverError(err));
  },

  create (req, res) {
    let createData = _.pick(req.body, ['title', 'content', 'imageUrl', 'category']);
    createData.user = req.user.id;

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
        if (_.isUndefined(articleFound)) {
          throw new EntityNotFoundError('Artículo no encontrado');
        }

        return res.json({
          data: articleFound
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  update (req, res) {
    let articleId = req.params.articleId;
    let updateData = _.pick(req.body, ['title', 'content', 'imageUrl', 'category']);

    ArticlesRepository
      .findOne({id: articleId})
      .then(articleFound => {
        if (_.isUndefined(articleFound)) {
          throw new EntityNotFoundError('Artículo no encontrado');
        }

        return articleFound.update(updateData);
      })
      .then(articleUpdated => {
        return res.json({
          data: articleUpdated
        });
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  },

  destroy (req, res) {
    let articleId = req.params.articleId;

    ArticlesRepository
      .findOne({id: articleId})
      .then(articleFound => {
        if (_.isUndefined(articleFound)) {
          throw new EntityNotFoundError('Artículo no encontrado');
        }

        return articleFound.destroy();
      })
      .then(articleDestroyed => {
        return res.json({message: 'Articulo eliminado'});
      })
      .catch(EntityNotFoundError, err => res.notFound(err))
      .catch(ValidationError, err => res.badRequest(err))
      .catch(DatabaseError, err => res.serverError(err));
  }
};
