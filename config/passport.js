'use strict';

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let UserRepository = require('../api/repositories/UserRepository');
let EntityNotFoundError = require('../api/errors/EntityNotFoundError');
let bcrypt = require('bcrypt');
let AuthError = require('../api/errors/AuthError');
let DatabaseError = require('../api/errors/DatabaseError');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserRepository
    .findOne({id: id})
    .then(userFound => {
      if (_.isUndefined(userFound)) {
        return done(new EntityNotFoundError('Usuario no encontrado'));
      }
      return done(null, userFound);
    })
    .catch(err => {
      sails.log.error(err);
      done(new DatabaseError());
    });
});

passport.use(new LocalStrategy(
  (email, password, done) => {
    UserRepository
      .findOne({email: email})
      .then(userFound => {
        if (_.isUndefined(userFound)) {
          return done(new EntityNotFoundError('Usuario no encontrado'));
        }

        if (userFound.isCorrectPassword(password)) {
          done(null, userFound);
        } else {
          done(new AuthError('La contraseña es incorrecta'));
        }
      })
      .catch(err => {
        done(new DatabaseError());
      })
  }
));