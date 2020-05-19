const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ReceiptClauseController = require('./receipt-clause.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ReceiptClauseController.create))
  .get(asyncWrapper(ReceiptClauseController.index));
router.route('/:id')
  .get(asyncWrapper(ReceiptClauseController.show))
  .put(asyncWrapper(ReceiptClauseController.update))
  .delete(asyncWrapper(ReceiptClauseController.delete));
module.exports = router;
