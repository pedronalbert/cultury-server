'use strict';

/* Dependencies */
let faker = require('faker');
let _ = require('lodash');
let expect = require('chai').expect;

let generateNewUserData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: '123456'
  };
};

describe.only('UsersController', () => {
  let userFixtures;

  before(() => {
    userFixtures = fixtures['user'];
  });

  describe('#index', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        guestAgent
          .get('/users')
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 200', done => {
        guestAgent
          .get('/users')
          .expect(200, done);
      });
    });
  });
});