'use strict';

let sails = require('sails');
let Barrels = require('barrels');
let request = require('supertest');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(25000);

  sails.lift({
    // configuration for testing purposes
    port: 1338,
    log: {
      level: 'error'
    }
  }, function(err, server) {
    if (err) return done(err);
    let barrels = new Barrels();
    global.fixtures = barrels.data;

    // Populate the DB
    barrels.populate(['user', 'article', 'publishrequest'], function(err) {
      if (err) return done(err);
      loadAgents(err => {
        done(err, sails);
      });
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

function loadAgents (cb) {
  let adminFixture = fixtures['user'][0];
  let userFixture = fixtures['user'][1];
  let modFixture = fixtures['user'][2];

  global.guestAgent = request.agent(sails.hooks.http.app);
  global.userAgent = request.agent(sails.hooks.http.app);
  global.adminAgent = request.agent(sails.hooks.http.app);
  global.modAgent = request.agent(sails.hooks.http.app);

  //Login Agents
  async.parallel([
    next => {
      userAgent
        .post('/login')
        .send({
          email: userFixture.email,
          password: userFixture.password
        })
        .expect(200)
        .end(next);
    },

    next => {
      adminAgent
        .post('/login')
        .send({
          email: adminFixture.email,
          password: adminFixture.password
        })
        .expect(200)
        .end(next);
    },

    next => {
      modAgent
        .post('/login')
        .send({
          email: modFixture.email,
          password: modFixture.password
        })
        .expect(200)
        .end(next);
    }
  ], (err, results) => {
    cb(err);
  });
}
