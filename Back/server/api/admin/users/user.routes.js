const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const UserController = require('./user.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(UserController.create))
  .get(asyncWrapper(UserController.index));

router.route('/login')
  .post(asyncWrapper(UserController.login));

router.route('/rights/options')
  .get(asyncWrapper(UserController.rightOptions));

router.route('/apps/me')
  .get(asyncWrapper(UserController.showApps));

router.route('/rights/:id')
  .get(asyncWrapper(UserController.showRights))
  .put(asyncWrapper(UserController.updateRights))
  .delete(asyncWrapper(UserController.deleteRights));

router.route('/:id')
  .get(asyncWrapper(UserController.show))
  .put(asyncWrapper(UserController.update))
  .delete(asyncWrapper(UserController.delete));

module.exports = router;
