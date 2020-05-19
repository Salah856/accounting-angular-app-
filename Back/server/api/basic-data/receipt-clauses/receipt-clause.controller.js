const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ReceiptClauseModel = require('./receipt-clause.model').ReceiptClause;
const DeletedReceiptClauseModel = require('./receipt-clause.model').DeletedReceiptClause;
const LogReceiptClauseModel = require('./receipt-clause.model').LogReceiptClause;

const schemas = require('./receipt-clause.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ بند القبض بنجاح|Receipt Clause created successfully',
  updated: 'تم تعديل بند القبض بنجاح|Receipt Clause updated successfully',
  deleted: 'تم حذف بند القبض بنجاح|Receipt Clause deleted successfully',
  foundAll: 'تم العثور على بنود القبض بنجاح|Receipt Clauses found successfully',
  foundOne: 'تم العثور على بند القبض بنجاح|Receipt Clause found successfully',
};

class ReceiptClauseController {
  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.ReceiptClauseSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name, constant } = req.body;
    const receiptClause = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      signature: req.signature,
      constant,
    };

    const createdReceiptClause = new ReceiptClauseModel(receiptClause);
    await createdReceiptClause.save();
    return res.send({ statusCode: 200, message: messages.created, receiptClause });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = ReceiptClauseModel.find();
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
    const countQuery = ReceiptClauseModel.estimatedDocumentCount();
    const [receiptClauses, count] = await Promise.all([query, countQuery]);
    const mappedReceiptClauses = receiptClauses.map(
      item => ({
        ...item.toObject(),
        constant: { value: item.constant, label: basicAttributes[item.constant.toString()] },
      }),
    );
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      receiptClauses: mappedReceiptClauses,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let receiptClause = await ReceiptClauseModel.findById(id);
    if (populate === '1') {
      receiptClause = {
        ...receiptClause.toObject(),
        constant: {
          value: receiptClause.constant,
          label: basicAttributes[receiptClause.constant.toString()],
        },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      receiptClause,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const receiptClause = await ReceiptClauseModel.findOneAndDelete({ _id: id });
    const deletedReceiptClause = new DeletedReceiptClauseModel(receiptClause.toObject());
    await deletedReceiptClause.save();
    return res.send({ statusCode: 200, message: messages.deleted, receiptClause });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.ReceiptClauseSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name, constant } = req.body;
    const newReceiptClause = {
      name: htmlEscape(name),
      signature: req.signature,
      constant,
    };
    const receiptClause = await ReceiptClauseModel
      .findByIdAndUpdate(id, { $set: { ...newReceiptClause } });
    const logReceiptClause = new LogReceiptClauseModel({
      _id: new mongoose.Types.ObjectId(),
      receiptClause: receiptClause.toObject(),
      message: `Updating Receipt Clause to ${JSON.stringify(newReceiptClause)}`,
      signature: req.signature,
    });
    await logReceiptClause.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      receiptClause: newReceiptClause,
    });
  }
}

module.exports = ReceiptClauseController;
