'use strict';

/* Dependencies */
let faker = require('faker');
let request = require('supertest');
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
  let payloadUser;

  before(() => {
    payloadUser = _.last(fixtures['user']);
  })
  describe('#create', () => {
    let createData = generateNewUserData();

    it('Responder 201', done => {
      request(sails.hooks.http.app)
        .post('/users')
        .send(createData)
        .expect(201, done);
    });

    it('Responder 400 al intentar crear duplicado', done => {
      request(sails.hooks.http.app)
        .post('/users')
        .send(createData)
        .expect(400, done);
    });
  });

  describe('#show', () => {
    it('Responder 200', done => {
      request(sails.hooks.http.app)
        .get('/users/' + payloadUser.id)
        .expect(200, done);
    });

    it('Responder 404', done => {
      request(sails.hooks.http.app)
        .get('/users/99')
        .expect(404, done);
    });
  });

  describe('#update', () => {
    it('Responder 200', done => {
      request(sails.hooks.http.app)
        .put('/users/' + payloadUser.id)
        .send(generateNewUserData())
        .expect(200, done);
    });

    it('Responder 404', done => {
      request(sails.hooks.http.app)
        .put('/users/99')
        .expect(404, done);
    });
  });

  describe('#changePassword', () => {
    it('Responder 200', done => {
      request(sails.hooks.http.app)
        .put('/users/' + payloadUser.id + '/actions/change-password')
        .send({oldPassword: payloadUser.password, newPassword: faker.internet.password()})
        .expect(200, done);
    });

    it('Responder 404', done => {
      request(sails.hooks.http.app)
        .put('/users/99/actions/change-password')
        .expect(404, done);
    });

    it('Responder 400 con contraseña incorrecta', done => {
      request(sails.hooks.http.app)
        .put('/users/' + payloadUser.id + '/actions/change-password')
        .send({oldPassword: null, newPassword: faker.internet.password()})
        .expect(400, done);
    });

  });
});