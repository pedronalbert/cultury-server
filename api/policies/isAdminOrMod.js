/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
'use strict';

module.exports = function(req, res, next) {
  if (req.user) {
    let role = req.user.role;

    if (role == 'admin' || role == 'mod') {
      return next();
    }
  }

  return res.unauthorized({title: 'No tiene los permisos necesarios'});
};
