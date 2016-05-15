/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */
'use strict';

module.exports = function badRequest(ValidationError, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;

  // Set status code
  res.status(400);

  let jsonResponse = {
    message: ValidationError.message,
    attributes: {}
  };

  _.each(ValidationError.attributes, (errors, attributeName) => {
    jsonResponse.attributes[attributeName] = errors[0].message;
  });

  return res.json(jsonResponse);
};
