const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const PaymentClauseController = require('./payment-clause.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(PaymentClauseController.create))
  .get(asyncWrapper(PaymentClauseController.index));
router.route('/:id')
  .get(asyncWrapper(PaymentClauseController.show))
  .put(asyncWrapper(PaymentClauseController.update))
  .delete(asyncWrapper(PaymentClauseController.delete));
module.exports = router;
