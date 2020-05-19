const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const StoreController = require('./store.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(StoreController.create))
  .get(asyncWrapper(StoreController.index));
router.route('/:id')
  .get(asyncWrapper(StoreController.show))
  .put(asyncWrapper(StoreController.update))
  .delete(asyncWrapper(StoreController.delete));
module.exports = router;
