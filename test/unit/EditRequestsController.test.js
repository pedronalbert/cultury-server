'use strict';
let request = require('supertest');
let faker = require('faker');
let async = require('async');

let generateNewData = () => {
  return {
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word(),
    article: 1
  }
};

describe('EditRequestController', () => {
  let editRequestFixtures;
  let baseUrl = '/edit-requests';

  before(() => {
    editRequestFixtures = fixtures['editrequest'];
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

  describe('#create', () => {
    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .post(baseUrl)
          .send(generateNewData())
          .expect(201, done);
      });

      it('Responder 400 con bad inputs', done => {
        userAgent
          .post(baseUrl)
          .send({title: ''})
          .expect(400, done);
      });
    });
  });

  describe('#show', () => {
    describe('Guest', () => {
      it('Responder 401 si no está logeado', done => {
        guestAgent
          .get(baseUrl + '/' + editRequestFixtures[0].id)
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
        .get(baseUrl + '/' + editRequestFixtures[0].id)
        .expect(200, done);
      });
    });
  });

  describe('#update', () => {
    describe('Guest', () => {
      it('Responder 401 al no estár logeado', done => {
        guestAgent
          .put(baseUrl + '/' + editRequestFixtures[0].id)
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 200', done => {
        userAgent
          .put(baseUrl + '/' + editRequestFixtures[1].id)
          .send(generateNewData())
          .expect(200, done);
      });

      it('Responder 400 con bad inputs', done => {
        userAgent
          .put(baseUrl + '/' + editRequestFixtures[1].id)
          .send({title: ''})
          .expect(400, done);
      });

      it('Responder 401 al editar el de otro usuario', done => {
        userAgent
          .put(baseUrl + '/' + editRequestFixtures[0].id)
          .send(generateNewData())
          .expect(401, done);
      });

      it('Responder 404 si no existe', done => {
        userAgent
          .put(baseUrl + '/0')
          .send(generateNewData())
          .expect(404, done);
      });
    });
  });

  describe('#publishAction', () => {
    describe('Guest', () => {
      it('Responder 401 al no estar logeado', done => {
        guestAgent
          .post(baseUrl + '/' + editRequestFixtures[0].id + '/actions/publish')
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401 al no tener permisos', done => {
        userAgent
          .post(baseUrl + '/' + editRequestFixtures[0].id + '/actions/publish')
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 200', done => {
        modAgent
          .post(baseUrl + '/' + editRequestFixtures[0].id + '/actions/publish')
          .send(generateNewData())
          .expect(200, done);
      });

      it('Responder 404 si no existe', done => {
        modAgent
          .post(baseUrl + '/0/actions/publish')
          .send(generateNewData())
          .expect(404, done);
      });
    });
  });

  describe('#denyAction', () => {
    describe('Guest', () => {
      it('Responder 401 al no estar logeado', done => {
        guestAgent
          .post(baseUrl + '/' + editRequestFixtures[1].id + '/actions/deny')
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('User', () => {
      it('Responder 401 al no tener permisos', done => {
        userAgent
          .post(baseUrl + '/' + editRequestFixtures[1].id + '/actions/deny')
          .send(generateNewData())
          .expect(401, done);
      });
    });

    describe('Mod', () => {
      it('Responder 200', done => {
        modAgent
          .post(baseUrl + '/' + editRequestFixtures[1].id + '/actions/deny')
          .send(generateNewData())
          .expect(200, done);
      });

      it('Responder 404 si no existe', done => {
        modAgent
          .post(baseUrl + '/0/actions/deny')
          .send(generateNewData())
          .expect(404, done);
      });
    });
  });
});
