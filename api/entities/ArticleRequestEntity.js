'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

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
          return reject(new DatabaseError('Error en el servidor, intente más tarde'));
        });
    });
  }

  publish (articleData) {
    let articleCreated;

    return new Promise((resolve, reject) => {

      Article
        .create(articleData)
        .then(article => {
          articleCreated = article;

          return this.destroy();
        })
        .then(() => {

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
            return reject(new ValidationError('Artículo no ha podido ser editado', err.Errors));
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = ArticleRequestEntity;