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
        adminAgent
          .get('/users')
          .expect(200, done);
      });
    });
  });

  describe('#create', () => {
    let userToCreate = generateNewUserData();

    it('Responder 201', done => {
      guestAgent
        .post('/users')
        .send(userToCreate)
        .expect(201, done);
    });

    it('Responder 400 al ser duplicado', done => {
      guestAgent
        .post('/users')
        .send(userToCreate)
        .expect(400, done);
    });
  });

  describe('#show', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        guestAgent
          .get('/users/' + userFixtures[0].id)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .get('/users/' + userFixtures[0].id)
          .expect(200, done);
      });

      it('Responder 404', done => {
        userAgent
          .get('/users/0')
          .expect(404,done);
      });
    });
  });
});