'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let DatabaseError = require('../errors/DatabaseError');
let ArticlesEditRequestsRepository = require('../repositories/ArticlesEditRequestsRepository');
let ArticlesRepository = require('../repositories/ArticlesRepository');

class ArticleRequestEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  destroy () {
    return new Promise((resolve, reject) => {
      ArticleEditRequest.destroy({id: this.id})
        .then(() => {
          return resolve(this);
        })
        .catch(err => {
          return reject(new DatabaseError('Error en el servidor, intente más tarde'));
        });
    });
  }

  publish (editRequestData) {
    let articleUpdated;

    return new Promise((resolve, reject) => {
      ArticlesRepository
        .findOne({id: this.article})
        .then(article => {
          return article.update(editRequestData);
        })
        .then(article => {
          articleUpdated = article;

          return this.destroy()
        })
        .then(() => {
          return resolve(articleUpdated);
        })
        .catch(ValidationError, EntityNotFoundError, DatabaseError, err => reject(err));
    });
  }
 
  update (newArticleData) {
    return new Promise((resolve, reject) => {

      ArticleEditRequest.update({id: this.id}, newArticleData)
        .then(articlesUpdated => {
          this._setAttributes(articlesUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          sails.log.error(err);

          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Peticion de edición no encontrada', err.Errors));
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
      article: this.article,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = ArticleRequestEntity;