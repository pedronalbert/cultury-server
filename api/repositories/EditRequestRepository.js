'use strict';

let Promise = require('bluebird');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let EditRequestEntity = require('../entities/EditRequestEntity');

let PublishRequestRepository = {
  find (criteria) {
    return new Promise((resolve, reject) => {
      EditRequest
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
      EditRequest
        .findOne(criteria)
        .then(editRequestFound => {
          if (_.isUndefined(editRequestFound)) {
            return resolve(undefined);
          }

          return resolve(new EditRequestEntity(editRequestFound));
        })
        .catch(err => {
          sails.log.error(err);
          return reject(new DatabaseError());
        })
    });
  },

  create (newEditRequest) {
    return new Promise ((resolve, reject) => {
      EditRequest
        .create(newEditRequest)
        .then(editRequestCreated => {
          return resolve(new EditRequestEntity(editRequestCreated));
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
