'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let ArticlesRepository = require('../repositories/ArticlesRepository');

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

  publish () {
    let createData = {
      title: this.title,
      content: this.content,
      imageUrl: this.imageUrl,
      category: this.category,
      user: this.user
    };

    return ArticlesRepository.create(createData);
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
      attributes: {
        title: this.title,
        content: this.content,
        imageUrl: this.imageUrl,
        category: this.category,
      },
      relationships: {
        user: {
          id: this.user
        }
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = PublishRequestEntity;
