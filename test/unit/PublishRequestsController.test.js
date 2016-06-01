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
  before(() => {
    publishRequestsFixtures = fixtures['publishrequest'];
  });
});
