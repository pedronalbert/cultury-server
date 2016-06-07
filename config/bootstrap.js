var faker = require('faker');
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(next) {
  next();
};

function articlesSeed () {
  var articlesSeeds = [];

  for (i = 0; i < 10; i++) {
    articlesSeeds.push({
      title: faker.lorem.text(),
      content: faker.lorem.paragraphs(),
      imageUrl: faker.image.imageUrl(),
      category: faker.lorem.word(),
      user: 1
    });
  }

  return Article
    .create(articlesSeeds)
}