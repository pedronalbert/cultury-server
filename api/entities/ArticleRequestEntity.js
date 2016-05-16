'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');

class ArticleRequestEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  destroy () {
    return new Promise((resolve, reject) => {
      ArticleRequest.destroy({id: this.id})
        .then(() => {
          return resolve(this);
        })
        .catch(err => {
          return reject(new DatabaseError('Error en la base de datos, intente más tarde'));
        });
    });
  }

  publish () {
    let articleData, articleCreated;

    return new Promise((resolve, reject) => {
      if (this.state == 'published') {
        return reject(new ValidationError('Artículo ya ha sido publicado'));
      }

      if (this.state == 'denied') {
        return reject(new ValidationError('Artículo ya ha sido denegado'));
      }

      articleData = {
        title: this.title,
        content: this.content,
        imageUrl: this.imageUrl,
        category: this.category
      };

      Article
        .create(articleData)
        .then(article => {
          sails.log.info('Article Created! #' + article.id);

          articleCreated = article;
          return this.update({state: 'published'});
        })
        .then(articleRequest => {
          sails.log.info('ArticleRequest Change state to published! #' + articleRequest.id);

          return resolve(articleCreated);
        })
        .catch(err => {
          sails.log.error(err);

          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser publicado', err.Errors));
          }

          return reject(new DatabaseError('Error en el servidor, intente mas tarde'));
        })
        .catch(ValidationError, DatabaseError, err => reject(err));
    });
  }

  deny () {
    return new Promise((resolve, reject) => {

      if (this.state == 'published') {
        return reject(new ValidationError('Artículo ya ha sido publicado'));
      }

      if (this.state == 'denied') {
        return reject(new ValidationError('Artículo ya ha sido denegado'));
      }

      this
        .update({state: 'denied'})
        .then(articleRequest => {
          sails.log.info('ArticleRequest Denied! ' + articleRequest.id);

          return resolve(articleRequest);
        })
        .catch(reject);
    })
  }
  
  update (newArticleData) {
    return new Promise((resolve, reject) => {

      ArticleRequest.update({id: this.id}, newArticleData)
        .then(articlesUpdated => {
          this._setAttributes(articlesUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          sails.log.error(err);

          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser actualizado', err.Errors));
          }

          return reject(new DatabaseError('Error en el servidor, intente mas tarde'));
        });
    });
  }

  _setAttributes (model) {
    _.each(model.toJSON(), (value, key) => {
      this[key] = value;
    });
  }

  toJSON () {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      imageUrl: this.imageUrl,
      category: this.category,
      state: this.state,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = ArticleRequestEntity;