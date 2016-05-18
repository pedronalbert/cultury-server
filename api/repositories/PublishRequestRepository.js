'use strict';

let Promise = require('bluebird');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let PublishRequestEntity = require('../entities/PublishRequestEntity');

let PublishRequestRepository = {
  find (criteria) {
    return new Promise((resolve, reject) => {
      PublishRequest
        .find(criteria)
        .then(resolve);
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      PublishRequest
        .findOne(criteria)
        .then(publishRequestFound => {
          if (_.isUndefined(publishRequestFound)) {
            return reject(new EntityNotFoundError('Artículo no encontrado'))
          }

          return resolve(new PublishRequestEntity(publishRequestFound));
        });
    });
  },

  create (newArticleData) {
    return new Promise ((resolve, reject) => {
      PublishRequest
        .create(newArticleData)
        .then(articleCreated => {
          return resolve(articleCreated);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Petición no ha podido ser creada', err.Errors));
          }

          return reject(new DatabaseError());
        });
    });
  }
};

module.exports = PublishRequestRepository;
