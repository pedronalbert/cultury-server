'use strict';
let passport = require('passport');

module.exports = {
  login (req, res) {

    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return res.unauthorized(err.message);
      } else{
        req.logIn(user, err => {
          if (err) {
            return res.unauthorized('Error al iniciar session, intente mas tarde');
          }

          return res.send({message: 'Session iniciada'});
        })
      }
    })(req, res);
  },

  logout (req, res) {
    req.logout();
    
    return res.send({message: 'Session Finalizada'});
  },

  me (req, res) {
    return res.json(req.user);
  }
};