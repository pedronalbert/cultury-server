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
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject(new DatabaseError());
        });
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      PublishRequest
        .findOne(criteria)
        .then(publishRequestFound => {
          if (_.isUndefined(publishRequestFound)) {
            return resolve(undefined);
          }

          return resolve(new PublishRequestEntity(publishRequestFound));
        })
        .catch(err => {
          sails.log.error(err);
          return reject(new DatabaseError());
        })
    });
  },

  create (newPublisRequest) {
    return new Promise ((resolve, reject) => {
      PublishRequest
        .create(newPublisRequest)
        .then(publishRequestCreated => {
          return resolve(new PublishRequestEntity(publishRequestCreated));
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Petición no ha podido ser creada', err.Errors));
          }
          sails.log.error(err);
          return reject(new DatabaseError());
        });
    });
  }
};

module.exports = PublishRequestRepository;
