'use strict';
let faker = require('faker');

module.exports = [
  {
    id: 1,
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word(),
    user: 1
  },
  {
    id: 2,
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word(),
    user: 1
  },
  {
    id: 3,
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    imageUrl: faker.image.imageUrl(),
    category: faker.lorem.word(),
    user: 1
  },
];