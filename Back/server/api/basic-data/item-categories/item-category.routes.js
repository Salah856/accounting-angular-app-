const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ItemCategoryController = require('./item-category.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ItemCategoryController.create))
  .get(asyncWrapper(ItemCategoryController.index));
router.route('/:id')
  .get(asyncWrapper(ItemCategoryController.show))
  .put(asyncWrapper(ItemCategoryController.update))
  .delete(asyncWrapper(ItemCategoryController.delete));
module.exports = router;
