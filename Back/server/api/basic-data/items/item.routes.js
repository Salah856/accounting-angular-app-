const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const ItemController = require('./item.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(ItemController.create))
  .get(asyncWrapper(ItemController.index));
router.route('/options')
  .get(asyncWrapper(ItemController.options));
router.route('/:id')
  .get(asyncWrapper(ItemController.show))
  .put(asyncWrapper(ItemController.update))
  .delete(asyncWrapper(ItemController.delete));
module.exports = router;
