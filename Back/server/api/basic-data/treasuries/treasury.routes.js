const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const TreasuryController = require('./treasury.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(TreasuryController.create))
  .get(asyncWrapper(TreasuryController.index));
router.route('/options')
  .get(asyncWrapper(TreasuryController.options));
router.route('/:id')
  .get(asyncWrapper(TreasuryController.show))
  .put(asyncWrapper(TreasuryController.update))
  .delete(asyncWrapper(TreasuryController.delete));
module.exports = router;
