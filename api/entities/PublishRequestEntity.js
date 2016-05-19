'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

class PublishRequestEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  destroy () {
    return new Promise((resolve, reject) => {
      PublishRequest.destroy({id: this.id})
        .then(() => {
          return resolve(this);
        })
        .catch(err => {
          sails.log.error(err);
          return reject(new DatabaseError());
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
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser publicado', err.Errors));
          }

          sails.log.error(err);
          return reject(new DatabaseError());
        })
        .catch(ValidationError, DatabaseError, err => reject(err));
    });
  }
  
  update (updateData) {
    return new Promise((resolve, reject) => {

      PublishRequest.update({id: this.id}, updateData)
        .then(articlesUpdated => {
          this._setAttributes(articlesUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser editado', err.Errors));
          }

          sails.log.error(err);
          return reject(new DatabaseError());
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

module.exports = PublishRequestEntity;