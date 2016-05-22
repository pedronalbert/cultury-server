'use strict';

let sails = require('sails');
let Barrels = require('barrels');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(10000);

  sails.lift({
    // configuration for testing purposes
    port: 1338,
    log: {
      level: 'error'
    }
  }, function(err, server) {
    if (err) return done(err);
     // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    global.fixtures = barrels.data;

    // Populate the DB
    barrels.populate(['user', 'publishrequest'], function(err) {
      done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});