const router = require('express').Router();
const asyncWrapper = require('../../../utils/async-wrapper');
const CompanyController = require('./company.controller');
// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .post(asyncWrapper(CompanyController.create))
  .get(asyncWrapper(CompanyController.index));
router.route('/:id')
  .get(asyncWrapper(CompanyController.show))
  .put(asyncWrapper(CompanyController.update))
  .delete(asyncWrapper(CompanyController.delete));
module.exports = router;
