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

describe('PublishRequestsController', () => {
  let userAgent, adminAgent, publishRequestCreatedId;

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
          .get('/publish-requests')
          .expect(401, done)
      });
    })

    describe('User', done => {
      it('Responder 200', done => {
        userAgent
          .get('/publish-requests')
          .expect(200, done)
      })
    });
  });

  describe('#create', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests')
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 201', done => {
        userAgent
          .post('/publish-requests')
          .send(generateNewData())
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            publishRequestCreatedId = res.body.data.id;
            done();
          })
      });
    });
  });

  describe('#update', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .put('/publish-requests/1')
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .put('/publish-requests/' + publishRequestCreatedId)
          .send(generateNewData())
          .expect(200, done);
      });

      it('Responder 401 Al no pertenecerle', done => {
        let publishRequestFixture = fixtures['publishrequest'][0];
        userAgent
          .put('/publish-requests/' + publishRequestFixture.id)
          .send(generateNewData())
          .expect(401, done);
      });
    });
  });

  describe('#publishAction', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests/' + publishRequestCreatedId + '/actions/publish')
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401', done => {
        userAgent
          .post('/publish-requests/' + publishRequestCreatedId + '/actions/publish')
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 201', done => {
        let publishRequestFixture = fixtures['publishrequest'][0];
        adminAgent
          .post('/publish-requests/' + publishRequestFixture.id + '/actions/publish')
          .send(generateNewData())
          .expect(201, done);
      });
    });
  });

  describe('#denyAction', () => {
    describe('Guest', () => {
      it('Responder 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests/' + publishRequestCreatedId + '/actions/deny')
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401', done => {
        userAgent
          .post('/publish-requests/' + publishRequestCreatedId + '/actions/deny')
          .expect(401, done);
      });
    });

    describe('Admin', () => {
      it('Responder 200', done => {
        let publishRequestFixture = fixtures['publishrequest'][1];
        adminAgent
          .post('/publish-requests/' + publishRequestFixture.id + '/actions/deny')
          .expect(200, done);
      });
    });
  });
});