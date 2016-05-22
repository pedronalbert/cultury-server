'use strict';
let request = require('supertest');
let faker = require('faker');

let generateNewData = () => {
  return {
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word()
  }
};

describe('PublishRequestsController', () => {
  describe('Without Login', () => {
    describe('#index', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .get('/publish-requests')
          .expect(401, done);
      });
    })

    describe('#create', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests')
          .expect(401, done);
      });
    });

    describe('#show', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .get('/publish-requests/1')
          .expect(401, done);
      });
    });

    describe('#update', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .put('/publish-requests/1')
          .expect(401, done);
      });
    });

    describe('#publishAction', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests/1/actions/publish')
          .expect(401, done);
      });
    });    

    describe('#denyAction', () => {
      it('Response 401', done => {
        request(sails.hooks.http.app)
          .post('/publish-requests/1/actions/deny')
          .expect(401, done);
      });
    });
  });

  describe('User login', () => {
    let createData = generateNewData();
    let publishRequestCreated;
    let userRequest;

    before(done => {
      let userData = fixtures['user'][1];
      userRequest = request.agent(sails.hooks.http.app);

      userRequest
        .post('/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200, done);
    });

    describe('#index', () => {
      it('Response 200', done => {
        userRequest
          .get('/publish-requests')
          .expect(200, done)
      });
    })

    describe('#create', () => {
      it('Response 201', done => {
        userRequest
          .post('/publish-requests')
          .send(createData)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            publishRequestCreated = res.body.data;
            done();
          });
      });
    });

    describe('#show', () => {
      it('Response 200', done => {
        userRequest
          .get('/publish-requests/' + publishRequestCreated.id)
          .expect(200, done);
      });
    });

    describe('#update', () => {
      it('Response 200', done => {
        userRequest
          .put('/publish-requests/' + publishRequestCreated.id)
          .send(generateNewData())
          .expect(200, done);
      });

      it('Response 401 si el artículo no le pertenece', done => {
        let otherPublishRequest = fixtures['publishrequest'][0];

        userRequest
          .put('/publish-requests/' + otherPublishRequest.id)
          .send(generateNewData())
          .expect(401, done);
      })
    });

    describe('#publishAction', () => {
      it('Response 401 por ser usuario', done => {
        userRequest
          .post('/publish-requests/1/actions/publish')
          .expect(401, done);
      });
    });    

    describe('#denyAction', () => {
      it('Response 401 por ser usuario', done => {
        userRequest
          .post('/publish-requests/1/actions/deny')
          .expect(401, done);
      });
    });
  });

  describe('Admin login', () => {
    let adminRequest;

    before(done => {
      let adminData = fixtures['user'][0];
      adminRequest = request.agent(sails.hooks.http.app);

      adminRequest
        .post('/login')
        .send({
          email: adminData.email,
          password: adminData.password
        })
        .expect(200, done);
    });

    describe('#publishAction', () => {
      it('Response 201', done => {
        let publishRequest = fixtures['publishrequest'][1];

        adminRequest
          .post('/publish-requests/' + publishRequest.id  +'/actions/publish')
          .send(generateNewData())
          .expect(201, done);
      });
    });    

    describe('#denyAction', () => {
      it('Response 200', done => {
        let publishRequest = fixtures['publishrequest'][2];

        adminRequest
          .post('/publish-requests/' + publishRequest.id  +'/actions/deny')
          .expect(200, done);
      });
    });
  });
});