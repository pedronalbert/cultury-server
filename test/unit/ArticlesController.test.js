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

describe('ArticlesController', () => {
  let userAgent, adminAgent, articleCreatedId;

  before(done => {
    let adminFixture = fixtures['user'][0];
    let userFixture = fixtures['user'][1];

    userAgent = request.agent(sails.hooks.http.app);
    adminAgent = request.agent(sails.hooks.http.app);

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
          .end((err, res) => {
            if (err) return done(err);
            next(null, res.body);
          });
      },

      next => {
        adminAgent
          .post('/login')
          .send({
            email: adminFixture.email,
            password: adminFixture.password
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            next(null, res.body);
          }); 
      }
    ], (err, results) => {
      done();
    });
  });

  describe('#index', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .get('/articles')
          .expect(401, done)
      });
    })

    describe('User', done => {
      it('Responder 200', done => {
        userAgent
          .get('/articles')
          .expect(200, done)
      })
    });
  });

  describe('#create', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .post('/articles')
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401', done => {
        userAgent
          .post('/articles')
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 200', done => {
        adminAgent
          .post('/articles')
          .send(generateNewData())
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            articleCreatedId = res.body.data.id;
          });
      });
    });
  });

  describe('#update', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .put('/articles/' + articleCreatedId)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401', done => {
        userAgent
          .put('/articles/' + articleCreatedId)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 200', done => {
        adminAgent
          .put('/articles/' + articleCreatedId)
          .send(generateNewData())
          .expect(200, done);
      });
    });
  });

  describe('#destroy', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .delete('/articles/' + articleCreatedId)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401', done => {
        userAgent
          .delete('/articles/' + articleCreatedId)
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 200', done => {        
        adminAgent
          .delete('/articles/' + articleCreatedId)
          .expect(401, done);
      });
    });
  });
});