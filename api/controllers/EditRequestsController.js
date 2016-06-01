'use strict';
let EditRequestRepository = require('../repositories/EditRequestRepository');
let DatabaseError = require('../errors/DatabaseError');

module.exports = {
  index (req, res) {
    EditRequestRepository
      .find()
      .then(editRequests => {
        return res.json({
          data: editRequests
        })
      })
      .catch(DatabaseError, err => res.serverError(err));
  }
}
