const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ExchangePermissionController = require('./exchange-permission.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ExchangePermissionController.create))
  .get(asyncWrapper(ExchangePermissionController.index));
router.route('/options')
  .get(asyncWrapper(ExchangePermissionController.options));
router.route('/:id')
  .get(asyncWrapper(ExchangePermissionController.show));
// .put(asyncWrapper(ExchangePermissionController.update))
// .delete(asyncWrapper(ExchangePermissionController.delete));
module.exports = router;
