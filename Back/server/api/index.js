const router = require('express').Router();
const basicDataFeature = require('./basic-data');
const adminFeature = require('./admin');
const storeOperationsFeature = require('./store-operations');

router.use('/basicData', basicDataFeature.routes);
router.use('/admin', adminFeature.routes);
router.use('/storeOperations', storeOperationsFeature.routes);

module.exports = { router };
