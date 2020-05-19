const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const AddingPermissionController = require('./adding-permission.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(AddingPermissionController.create))
  .get(asyncWrapper(AddingPermissionController.index));
router.route('/options')
  .get(asyncWrapper(AddingPermissionController.options));
router.route('/:id')
  .get(asyncWrapper(AddingPermissionController.show));
// .put(asyncWrapper(AddingPermissionController.update))
// .delete(asyncWrapper(AddingPermissionController.delete));
module.exports = router;
