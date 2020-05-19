const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const RightModel = require('./right.model');

const schemas = require('./right.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الحق بنجاح|Right created successfully',
  updated: 'تم تعديل الحق بنجاح|Right updated successfully',
  deleted: 'تم حذف الحق بنجاح|Right deleted successfully',
  foundAll: 'تم العثور على الحقوق بنجاح|Rights found successfully',
  foundOne: 'تم العثور على الحق بنجاح|Right found successfully',
};

class RightController {
  static async getRights(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = RightModel.find();
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
    const countQuery = RightModel.estimatedDocumentCount();
    const [rights, count] = await Promise.all([query, countQuery]);
    return { rights, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.rightSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name, rightId } = req.body;
    const right = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      rightId: parseInt(htmlEscape(rightId), 10),
      signature: req.signature,
    };
    const createdRight = new RightModel(right);
    await createdRight.save();
    return res.send({ statusCode: 200, message: messages.created, right });
  }

  static async index(req, res) {
    const { rights, count } = await RightController.getRights(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const right = await RightModel.findById(id);
    return res.send({ statusCode: 200, message: messages.foundOne, right });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const right = await RightModel.findOneAndDelete({ _id: id });
    return res.send({ statusCode: 200, message: messages.deleted, right });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.rightSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name, rightId } = req.body;
    const newRight = {
      name: htmlEscape(name),
      rightId: parseInt(htmlEscape(rightId), 10),
      signature: req.signature,
    };
    const right = await RightModel
      .findByIdAndUpdate(id, { $set: { ...newRight } }, { new: true });

    return res.send({ statusCode: 200, message: messages.updated, right });
  }
}

module.exports = RightController;
