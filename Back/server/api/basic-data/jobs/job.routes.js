const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const JobController = require('./job.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(JobController.create))
  .get(asyncWrapper(JobController.index));
router.route('/:id')
  .get(asyncWrapper(JobController.show))
  .put(asyncWrapper(JobController.update))
  .delete(asyncWrapper(JobController.delete));
module.exports = router;
