'use strict';

let Promise = require('bluebird');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let ArticleRequestEntity = require('../entities/ArticleRequestEntity');

let ArticlesRepository = {
  find (criteria) {
    return new Promise((resolve, reject) => {
      ArticleRequest
        .find(criteria)
        .then(resolve);
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      ArticleRequest
        .findOne(criteria)
        .then(articleFound => {
          if (_.isUndefined(articleFound)) {
            return reject(new EntityNotFoundError('Artículo no encontrado'))
          }

          return resolve(new ArticleRequestEntity(articleFound));
        });
    });
  },

  create (newArticleData) {
    return new Promise ((resolve, reject) => {
      ArticleRequest
        .create(newArticleData)
        .then(articleCreated => {
          return resolve(articleCreated);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser publicado', err.Errors));
          }

          return reject(new DatabaseError('Error en el servidor, intente más tarde'));
        });
    });
  }
};

module.exports = ArticlesRepository;
