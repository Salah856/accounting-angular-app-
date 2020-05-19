const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const AddingRequestController = require('./adding-request.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(AddingRequestController.create))
  .get(asyncWrapper(AddingRequestController.index));
router.route('/options')
  .get(asyncWrapper(AddingRequestController.options));
router.route('/convertToPermission/:id')
  .put(asyncWrapper(AddingRequestController.convertToPermission));
router.route('/:id')
  .get(asyncWrapper(AddingRequestController.show))
  .put(asyncWrapper(AddingRequestController.update))
  .delete(asyncWrapper(AddingRequestController.delete));
module.exports = router;
