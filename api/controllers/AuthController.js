'use strict';
let passport = require('passport');

module.exports = {
  login (req, res) {
    let email = req.param('email');
    let password = req.param('password');

    if (_.isEmpty(email) || _.isEmpty(password)) {
      return res.unauthorized({
        title: 'Error al iniciar session',
        detail: 'Debe llenar los datos'
      });
    }
    
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return res.unauthorized(err);
      }

      req.logIn(user, err => {
        if (err) {
          return res.unauthorized(err);
        }

        sails.log.info('Login success user #' + user.id);
        return res.json({message: 'Session iniciada'});
      })
    })(req, res);
  },

  logout (req, res) {
    req.logOut();
    return res.json({message: 'Session Finalizada'});
  },

  me (req, res) {
    return res.json(req.user);
  }
};