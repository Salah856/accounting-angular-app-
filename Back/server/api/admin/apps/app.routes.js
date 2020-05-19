const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const AppController = require('./app.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(AppController.create))
  .get(asyncWrapper(AppController.index));

router.route('/:id')
  .get(asyncWrapper(AppController.show))
  .put(asyncWrapper(AppController.update))
  .delete(asyncWrapper(AppController.delete));

module.exports = router;
