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

describe.only('ArticlesController', () => {
  let articlesFixtures;
  let baseUrl = '/articles';

  before(() => {
    articlesFixtures = fixtures['article'];
  });

  describe('#index', () => {
    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .get(baseUrl)
          .expect(200, done);
      });
    });

    describe('Guest', () => {
      it('Responder 401 si no está logeado', done => {
        guestAgent
          .get(baseUrl)
          .expect(401, done);
      });
    });
  });

  describe('#create', () => {
    describe('Admin', () => {
      it('Responder 201', done => {
        adminAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(201, done);
      });

      it('Responder 400 con bad inputs', done => {
        adminAgent
          .post(baseUrl)
          .expect(400, done);
      });
    });

    describe('User', () => {
      it('Responder 401 al ser usuario común', done => {
        userAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 201', done => {
        modAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(201, done);
      });
    });
  });

  describe('#show', () => {
    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .get(baseUrl + '/' + articlesFixtures[0].id)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .get(baseUrl + '/' + articlesFixtures[0].id)
          .expect(200, done);
      });

      it('Responder 404', done => {
        userAgent
          .get(baseUrl + '/0')
          .expect(404, done);
      });
    });
  });
});
