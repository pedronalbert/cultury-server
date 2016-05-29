/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  if (req.user) {
    if (req.user.role == 'admin') {
      return next();
    }

    if (req.user.id != req.params.id) {
      return res.unauthorized({title: 'Debe ser admin'});
    }
  }

  return next();
};
