const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ItemUnitController = require('./item-unit.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ItemUnitController.create))
  .get(asyncWrapper(ItemUnitController.index));
router.route('/:id')
  .get(asyncWrapper(ItemUnitController.show))
  .put(asyncWrapper(ItemUnitController.update))
  .delete(asyncWrapper(ItemUnitController.delete));
module.exports = router;
