const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ItemTypeController = require('./item-type.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ItemTypeController.create))
  .get(asyncWrapper(ItemTypeController.index));
router.route('/:id')
  .get(asyncWrapper(ItemTypeController.show))
  .put(asyncWrapper(ItemTypeController.update))
  .delete(asyncWrapper(ItemTypeController.delete));
module.exports = router;
