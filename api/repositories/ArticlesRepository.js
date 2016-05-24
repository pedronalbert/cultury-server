'use strict';

let Promise = require('bluebird');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let ArticleEntity = require('../entities/ArticleEntity');

let ArticlesRepository = {
  find (criteria) {
    return new Promise((resolve, reject) => {
      Article
        .find(criteria)
        .then(articles => {
          let articlesEntities = [];

          _.each(articles, article => {
            articlesEntities.push(new ArticleEntity(article));
          });

          return resolve(articles);
        })
        .catch(err => {
          sails.log.error(err);

          if (err) {
            return reject(new DatabaseError());
          }
        })
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      Article
        .findOne(criteria)
        .then(articleFound => {
          if (_.isUndefined(articleFound)) {
            return resolve(undefined);
          }

          return resolve(new ArticleEntity(articleFound));
        })
        .catch(err => {
          sails.log.error(err);

          return reject(new DatabaseError());
        })
    });
  },

  create (newArticleData) {
    return new Promise ((resolve, reject) => {
      Article
        .create(newArticleData)
        .then(articleCreated => {
          return resolve(articleCreated);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser publicado', err.Errors));
          }

          return reject(new DatabaseError());
        });
    });
  }
};

module.exports = ArticlesRepository;
