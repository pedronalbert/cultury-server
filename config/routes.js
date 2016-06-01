/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'get /articles': 'ArticlesController.index',
  'get /articles/:articleId': 'ArticlesController.show',
  'post /articles': 'ArticlesController.create',
  'put /articles/:articleId': 'ArticlesController.update',
  'delete /articles/:articleId': 'ArticlesController.destroy',
  //ArticlesRequests
  'get /publish-requests': 'PublishRequestsController.index',
  'get /publish-requests/:publishRequestId': 'PublishRequestsController.show',
  'post /publish-requests': 'PublishRequestsController.create',
  'put /publish-requests/:publishRequestId': 'PublishRequestsController.update',
  'post /publish-requests/:publishRequestId/actions/publish': 'PublishRequestsController.publishAction',
  'post /publish-requests/:publishRequestId/actions/deny': 'PublishRequestsController.denyAction',

  //ArticlesEditRequests
  'get /edit-requests': 'EditRequestsController.index',
  'post /edit-requests': 'EditRequestsController.create',
  'get /edit-requests/:editRequestId': 'EditRequestsController.show',
  'post /edit-requests/:editRequestId': 'EditRequestsController.update',
  'post /edit-requests/:editRequestId/actions/publish': 'EditRequestsController.publishAction',
  'post /edit-requests/:editRequestId/actions/deny': 'EditRequestsController.denyAction',
  //UsersController
  'get /users': 'UsersController.index',
  'get /users/:id': 'UsersController.show',
  'post /users': 'UsersController.create',
  'put /users/:id': 'UsersController.update',
  'put /users/:id/actions/change-password': 'UsersController.changePassword',
  //AuthController
  'post /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /me': 'AuthController.me'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
