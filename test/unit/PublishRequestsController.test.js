'use strict';
let request = require('supertest');

describe('PublishRequestsController', () => {
  describe.only('Without Login', () => {
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
});