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


describe('UsersController', () => {
  let createData = generateNewUserData();
  let userCreated;

  describe('#create', () => {
    it('Responder 201', done => {
      request(sails.hooks.http.app)
        .post('/users')
        .send(createData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          userCreated = res.body.data;
          done();
        })
    });
  });

  describe('#show', () => {
    it('Should response 200', done => {
      request(sails.hooks.http.app)
        .get('/users/' + userCreated.id)
        .expect(200, done);
    });
  });

  describe('#update', () => {
    it('Should response 200', done => {
      request(sails.hooks.http.app)
        .put('/users/' + userCreated.id)
        .send(generateNewUserData())
        .expect(200, done);
    });
  });

  describe('#changePassword', () => {
    it('Should response 200', done => {
      request(sails.hooks.http.app)
        .put('/users/' + userCreated.id + '/actions/change-password')
        .send({oldPassword: createData.password, newPassword: faker.internet.password()})
        .expect(200, done);
    });
  });
});