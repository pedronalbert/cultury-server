'use strict';
let request = require('supertest');
let faker = require('faker');
let async = require('async');
let expect = require('chai').expect;

let generateNewData = () => {
  return {
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word()
  }
};

describe('ArticlesController', () => {
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
          .query({
            page_number: 1,
            page_size: 20
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            let response = res.body;

            expect(response.data).to.be.an('array');
            expect(response.meta.page_number).to.be.equal(1);
            expect(response.meta.page_count).to.be.above(0);
            expect(response.meta.page_size).to.be.equal(20);
            done();
          })
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

  describe('#update', () => {
    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .put(baseUrl + '/' + articlesFixtures[0].id)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401 al no tener permiso', done => {
        userAgent
          .put(baseUrl + '/' + articlesFixtures[0].id)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 200', done => {
        modAgent
          .put(baseUrl + '/' + articlesFixtures[0].id)
          .send(generateNewData())
          .expect(200, done);
      });

      it('Responder 404', done => {
        modAgent
          .put(baseUrl + '/0')
          .send(generateNewData())
          .expect(404, done);
      });

      it('Responder 400 con bad inputs', done => {
        modAgent
          .put(baseUrl + '/' + articlesFixtures[0].id)
          .send({title: '', content: ''})
          .expect(400, done);
      });
    });
  });

  describe('#destroy', () => {
    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .delete(baseUrl + '/' + articlesFixtures[0].id)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401 al no tener permiso', done => {
        userAgent
          .delete(baseUrl + '/' + articlesFixtures[0].id)
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 200', done => {
        modAgent
          .delete(baseUrl + '/' + articlesFixtures[0].id)
          .expect(200, done);
      });

      it('Responder 404', done => {
        modAgent
          .delete(baseUrl + '/' + articlesFixtures[0].id)
          .expect(404, done);
      });
    });

    //Restore destroyed
    after(done => {
      Article.create(articlesFixtures[0]).exec(done);
    });
  });
});
