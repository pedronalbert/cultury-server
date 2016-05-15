'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = ArticleRequestEntity;