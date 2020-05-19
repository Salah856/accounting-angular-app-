const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const RightController = require('./right.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(RightController.create))
  .get(asyncWrapper(RightController.index));
router.route('/:id')
  .get(asyncWrapper(RightController.show))
  .put(asyncWrapper(RightController.update))
  .delete(asyncWrapper(RightController.delete));
module.exports = router;
