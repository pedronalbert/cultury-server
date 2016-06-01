'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');

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
