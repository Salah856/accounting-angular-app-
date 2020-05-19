const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const CurrencyController = require('./currency.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(CurrencyController.create))
  .get(asyncWrapper(CurrencyController.index));
router.route('/:id')
  .get(asyncWrapper(CurrencyController.show))
  .put(asyncWrapper(CurrencyController.update))
  .delete(asyncWrapper(CurrencyController.delete));
module.exports = router;
