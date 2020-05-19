const router = require('express').Router();
const addingPermissionFeature = require('./adding-permission');
const exchangePermissionFeature = require('./exchange-permission');
const addingRequestFeature = require('./adding-request');
const exchangeRequestFeature = require('./exchange-request');

const rightsMiddleware = require('../../middlewares/rights.middleware');
const asyncWrapper = require('../../utils/async-wrapper');
// api router will mount other routers
// for all our resources. Each resource directory
// has a resourceRoutes.js file with the router ready to go,
// require them and mount them to their respective routes below

router.use('/addingPermissions', asyncWrapper(rightsMiddleware('addingPermissions')), addingPermissionFeature.routes);
router.use('/exchangePermissions', asyncWrapper(rightsMiddleware('exchangePermissions')), exchangePermissionFeature.routes);
router.use('/addingRequests', asyncWrapper(rightsMiddleware('addingRequests')), addingRequestFeature.routes);
router.use('/exchangeRequests', asyncWrapper(rightsMiddleware('exchangeRequests')), exchangeRequestFeature.routes);


module.exports = {
  routes: router,
  AddingPermissionController: addingPermissionFeature.controller,
  ExchangePermissionController: exchangePermissionFeature.controller,
  AddingRequestController: addingRequestFeature.controller,
  ExchangeRequestController: exchangeRequestFeature.controller,

};
