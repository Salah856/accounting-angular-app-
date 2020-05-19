const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const FoundationController = require('./foundation.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(FoundationController.create))
  .get(asyncWrapper(FoundationController.index));

router.route('/:id')
  .get(asyncWrapper(FoundationController.show))
  .put(asyncWrapper(FoundationController.update))
  .delete(asyncWrapper(FoundationController.delete));

module.exports = router;
