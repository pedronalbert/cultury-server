'use strict';
let Promise = require('bluebird');
let ValidationError = require('../errors/ValidationError');
let EntityNotFoundError = require('../errors/EntityNotFoundError');

class ArticleEntity {
  constructor (model) {
    this._setAttributes(model);
  }

  update (newArticleData) {
    return new Promise((resolve, reject) => {

      Article.update({id: this.id}, newArticleData)
        .then(articlesUpdated => {
          this._setAttributes(articlesUpdated[0]);

          return resolve(this);
        })
        .catch(err => {
          if (err.code == 'E_VALIDATION') {
            return reject(new ValidationError('Artículo no ha podido ser actualizado', err.Errors));
          }
        });
    });
  }

  /**
   * @todo Delete all references
   */

  destroy () {
    return new Promise((resolve, reject) => {
      Article.destroy({id: this.id})
        .then(() => {
          return resolve(this);
        })
        .catch(err => {
          return reject(new DatabaseError());
        });
    });
  }

  _setAttributes (model) {
    _.each(model.toJSON(), (value, key) => {
      this[key] = value;
    });
  }

  toJSON () {
    return {
      id: this.id,
      attributes: {
        title: this.title,
        content: this.content,
        imageUrl: this.imageUrl,
        category: this.category
      },
      relationships: {
        user: {
          id: this.user
        }
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

module.exports = ArticleEntity;