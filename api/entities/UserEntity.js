'use strict';
let Promise = require('bluebird');
let bcrypt = require('bcrypt');
let ValidationError = require('../errors/ValidationError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');
let DatabaseError = require('../errors/DatabaseError');

class UserEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  update (newUserData) {
    return new Promise((resolve, reject) => {

      User.update({id: this.id}, newUserData)
        .then(usersUpdated => {
          this._setAttributes(usersUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Usuario no ha podido ser actualizado', err.Errors));
          }

          return reject(new DatabaseError('Error en el servidor, intente más tarde'));
        });
    });
  }

  changePassword (oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      if (this.isCorrectPassword(oldPassword)) {
        this.update({password: newPassword})
          .then(resolve)
          .catch(reject);
      } else {
        let validationError = new ValidationError('No se ha podido cambiar la contraseña');
        validationError.addAttribute('oldPassword', 'Contraseña incorrecta');

        return reject(validationError);
      }
    });
  }

  isCorrectPassword (passwordInput) {
    return bcrypt.compareSync(passwordInput, this.password);
  }

  _setAttributes (model) {
    _.each(model.toJSON(), (value, key) => {
      this[key] = value;
    });
  }

  toJSON () {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = UserEntity;