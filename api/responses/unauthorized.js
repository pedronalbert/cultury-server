module.exports = function notFound (data) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;

  // Set status code
  res.status(401);

  return res.json(data);
};

