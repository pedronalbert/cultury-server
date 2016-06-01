'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let ArticlesRepository = require('../repositories/ArticlesRepository');
let EntityNotFoundError = require('../errors/EntityNotFoundError');

class EditRequestEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  destroy () {
    return new Promise((resolve, reject) => {
      EditRequest.destroy({id: this.id})
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
    };

    return new Promise((resolve, reject) => {
      ArticlesRepository
        .findOne({id: this.article})
        .then(articleFound => {
          if (_.isUndefined(articleFound)) {
            throw new EntityNotFoundError('Artículo no encontrado');
          }

          return articleFound.update(createData);
        })
        .then(articleUpdated => {
          resolve(articleUpdated);

          return this.destroy();
        })
        .catch(reject)
    });
  }

  update (updateData) {
    return new Promise((resolve, reject) => {

      EditRequest.update({id: this.id}, updateData)
        .then(editRequestsUpdated => {
          this._setAttributes(editRequestsUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Petición no ha podido ser editada', err.Errors));
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
        },
        article: {
          id: this.article
        }
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = EditRequestEntity;
