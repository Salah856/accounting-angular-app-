const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const JobModel = require('./job.model').Job;
const DeletedJobModel = require('./job.model').DeletedJob;
const LogJobModel = require('./job.model').LogJob;

const schemas = require('./job.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الوظيفة بنجاح|Job created successfully',
  updated: 'تم تعديل الوظيفة بنجاح|Job updated successfully',
  deleted: 'تم حذف الوظيفة بنجاح|Job deleted successfully',
  foundAll: 'تم العثور على الوظائف بنجاح|Jobs found successfully',
  foundOne: 'تم العثور على الوظيفة بنجاح|Job found successfully',
};

class JobController {
  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.jobSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name } = req.body;
    const job = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      signature: req.signature,
    };

    const createdJob = new JobModel(job);
    await createdJob.save();
    return res.send({ statusCode: 200, message: messages.created, job });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = JobModel.find();
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }
    if (skip) {
      query = query.skip(parseInt(skip, 10));
    }
    if (sortField && sortDirection) {
      const sortObj = {};
      sortObj[sortField] = sortDirection === 'asc' ? 1 : -1;
      query = query.sort(sortObj);
    }
    const countQuery = JobModel.estimatedDocumentCount();
    const [jobs, count] = await Promise.all([query, countQuery]);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      jobs,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const job = await JobModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      job,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const job = await JobModel.findOneAndDelete({ _id: id });
    const deletedJob = new DeletedJobModel(job.toObject());
    await deletedJob.save();
    return res.send({ statusCode: 200, message: messages.deleted, job });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.jobSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name } = req.body;
    const newJob = {
      name: htmlEscape(name),
      signature: req.signature,
    };
    const job = await JobModel
      .findByIdAndUpdate(id, { $set: { ...newJob } });
    const logJob = new LogJobModel({
      _id: new mongoose.Types.ObjectId(),
      job: job.toObject(),
      message: `Updating Job to ${JSON.stringify(newJob)}`,
      signature: req.signature,
    });
    await logJob.save();
    return res.send({ statusCode: 200, message: messages.updated, job: newJob });
  }
}

module.exports = JobController;
