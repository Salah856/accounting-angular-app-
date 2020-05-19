const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ExchangeRequestController = require('./exchange-request.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ExchangeRequestController.create))
  .get(asyncWrapper(ExchangeRequestController.index));
router.route('/options')
  .get(asyncWrapper(ExchangeRequestController.options));
router.route('/convertToPermission/:id')
  .put(asyncWrapper(ExchangeRequestController.convertToPermission));
router.route('/:id')
  .get(asyncWrapper(ExchangeRequestController.show))
  .put(asyncWrapper(ExchangeRequestController.update))
  .delete(asyncWrapper(ExchangeRequestController.delete));
module.exports = router;
