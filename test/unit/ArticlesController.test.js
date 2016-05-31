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

});
