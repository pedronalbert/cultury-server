'use strict';

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let UserRepository = require('../api/repositories/UserRepository');
let EntityNotFoundError = require('../api/errors/EntityNotFoundError');
let bcrypt = require('bcrypt');
let AuthError = require('../api/errors/AuthError');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserRepository
    .findOne({id: id})
    .then(userFound => done(null, userFound))
    .catch(err => done(err));
});

passport.use(new LocalStrategy(
  function(email, password, done) {
    UserRepository
      .findOne({email: email})
      .then(userFound => {
        if (userFound.isCorrectPassword(password)) {
          done(null, userFound);
        } else {
          done(new AuthError('La contraseña es incorrecta'));
        }
      })
      .catch(EntityNotFoundError, done);
  }
));