const router = require('express').Router();
const itemTypeFeature = require('./item-types');
const itemUnitFeature = require('./item-units');
const itemCategoryFeature = require('./item-categories');
const paymentClauseFeature = require('./payment-clauses');
const receiptClauseFeature = require('./receipt-clauses');
const currenciesFeature = require('./currencies');
const companyFeature = require('./companies');
const treasuryFeature = require('./treasuries');
const storeFeature = require('./stores');
const itemFeature = require('./items');
const jobFeature = require('./jobs');
const rightsMiddleware = require('../../middlewares/rights.middleware');
const asyncWrapper = require('../../utils/async-wrapper');
// api router will mount other routers
// for all our resources. Each resource directory
// has a resourceRoutes.js file with the router ready to go,
// require them and mount them to their respective routes below

router.use('/itemTypes', asyncWrapper(rightsMiddleware('itemTypes')), itemTypeFeature.routes);
router.use('/itemUnits', asyncWrapper(rightsMiddleware('itemUnits')), itemUnitFeature.routes);
router.use('/itemCategories', asyncWrapper(rightsMiddleware('itemCategories')), itemCategoryFeature.routes);
router.use('/paymentClauses', asyncWrapper(rightsMiddleware('paymentClauses')), paymentClauseFeature.routes);
router.use('/receiptClauses', asyncWrapper(rightsMiddleware('receiptClauses')), receiptClauseFeature.routes);
router.use('/currencies', asyncWrapper(rightsMiddleware('currencies')), currenciesFeature.routes);
router.use('/companies', asyncWrapper(rightsMiddleware('companies')), companyFeature.routes);
router.use('/treasuries', asyncWrapper(rightsMiddleware('treasuries')), treasuryFeature.routes);
router.use('/stores', asyncWrapper(rightsMiddleware('stores')), storeFeature.routes);
router.use('/items', asyncWrapper(rightsMiddleware('items')), itemFeature.routes);
router.use('/jobs', asyncWrapper(rightsMiddleware('jobs')), jobFeature.routes);

module.exports = {
  routes: router,
  CurrencyController: currenciesFeature.controller,
  ItemTypeController: itemTypeFeature.controller,
  ItemUnitController: itemUnitFeature.controller,
  ItemCategoryController: itemCategoryFeature.controller,
  CompanyController: companyFeature.controller,
};
