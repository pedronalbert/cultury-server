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

          return resolve(articlesEntities);
        })
        .catch(err => {
          sails.log.error(err);

          if (err) {
            return reject(new DatabaseError());
          }
        })
    });
  },

  paginate (criteria, pagination) {
    let page_count;

    return new Promise((resolve, reject) => {
      Article
        .count(criteria)
        .then(count => {
          page_count = Math.ceil(count / pagination.page_size);

          if (page_count < pagination.page_number) {
            return resolve({
              articles: [],
              pagination: {
                page_number: pagination.page_number,
                page_size: pagination.page_size,
                page_count: page_count
              }
            });
          } else {
            criteria.limit = pagination.page_size;
            criteria.skip = pagination.page_size * (pagination.page_number - 1);

            return ArticlesRepository.find(criteria);
          }
        })
        .then(articles => {
          return resolve({
            articles: articles,
            pagination: {
              page_number: pagination.page_number,
              page_size: pagination.page_size,
              page_count: page_count
            }
          });
        })
        .catch(err => {
          return reject(new DatabaseError());
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
