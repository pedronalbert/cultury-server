'use strict';

let Promise = require('bluebird');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let ValidationError = require('../errors/ValidationError');
let DatabaseError = require('../errors/DatabaseError');
let ArticleEditRequestEntity = require('../entities/ArticleEditRequestEntity');
let ArticlesRepository = require('./ArticlesRepository');

let ArticlesEditRequestsRepository = {
  find (criteria) {
    return new Promise((resolve, reject) => {
      ArticleEditRequest
        .find(criteria)
        .then(resolve);
    });
  },

  findOne (criteria) {
    return new Promise((resolve, reject) => {
      ArticleEditRequest
        .findOne(criteria)
        .then(articleFound => {
          if (_.isUndefined(articleFound)) {
            return reject(new EntityNotFoundError('Petición no encontrada'))
          }

          return resolve(new ArticleEditRequestEntity(articleFound));
        });
    });
  },

  /**
   * @todo Validar que el usuario no tenga ya una petición en ese artículo
   */
  create (editRequestData) {
    let validationError;
    return new Promise ((resolve, reject) => {
      ArticlesRepository
        .findOne({id: editRequestData.article})
        .then(article => {
          return ArticleEditRequest.create(editRequestData)
        })
        .then(editRequestCreated => {
          return resolve(editRequestCreated);
        })
        .catch(DatabaseError, err => reject(err))
        .catch(EntityNotFoundError, err => {
          validationError = new ValidationError('No se ha podido crear la petición', {
            article: 'Artículo no existe'
          });

          return reject(validationError)
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Petición no ha podido ser publicada', err.Errors));
          }

          return reject(new DatabaseError('Error en el servidor, intente más tarde'));
        })
    });
  }
};

module.exports = ArticlesEditRequestsRepository;
