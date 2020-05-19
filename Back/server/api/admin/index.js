const router = require('express').Router();
const userFeature = require('./users');
const rightFeature = require('./rights');
const foundationFeature = require('./foundations');
const appFeature = require('./apps');
const rightsMiddleware = require('../../middlewares/rights.middleware');
const asyncWrapper = require('../../utils/async-wrapper');

// api router will mount other routers
// for all our resources. Each resource directory
// has a resourceRoutes.js file with the router ready to go,
// require them and mount them to their respective routes below

router.use('/users', asyncWrapper(rightsMiddleware('users')), userFeature.routes);
router.use('/rights', rightFeature.routes);
router.use('/foundations', asyncWrapper(rightsMiddleware('foundations')), foundationFeature.routes);
router.use('/apps', appFeature.routes);

module.exports = {
  routes: router,
  UserController: userFeature.controller,
  RightController: rightFeature.controller,
  FoundationController: foundationFeature.controller,
  AppController: appFeature.controller,
};
