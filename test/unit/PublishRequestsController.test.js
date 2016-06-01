'use strict';
let request = require('supertest');
let faker = require('faker');
let async = require('async');

let generateNewData = () => {
  return {
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word()
  }
};

describe.only('PublishRequestsController', () => {
  let publishRequestsFixtures;
  let baseUrl = '/publish-requests';

  before(() => {
    publishRequestsFixtures = fixtures['publishrequest'];
  });

  describe('#index', () => {
    describe('Guest', () => {
      it('Responder 401 si no está logeado', done => {
        guestAgent
          .get(baseUrl)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401 si no tiene permisos', done => {
        userAgent
          .get(baseUrl)
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 200', done => {
        modAgent
          .get(baseUrl)
          .expect(200, done);
      });
    });
  });
});
