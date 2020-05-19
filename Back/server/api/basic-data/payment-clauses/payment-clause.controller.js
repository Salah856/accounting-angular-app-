const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const PaymentClauseModel = require('./payment-clause.model').PaymentClause;
const DeletedPaymentClauseModel = require('./payment-clause.model').DeletedPaymentClause;
const LogPaymentClauseModel = require('./payment-clause.model').LogPaymentClause;
const schemas = require('./payment-clause.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ بند الدفع بنجاح|Payment Clause created successfully',
  updated: 'تم تعديل بند الدفع بنجاح|Payment Clause updated successfully',
  deleted: 'تم حذف بند الدفع بنجاح|Payment Clause deleted successfully',
  foundAll: 'تم العثور على بنود الدفع بنجاح|Payment Clauses found successfully',
  foundOne: 'تم العثور على بند الدفع بنجاح|Payment Clause found successfully',
};

class PaymentClauseController {
  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.PaymentClauseSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name, constant } = req.body;
    const paymentClause = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      constant,
      signature: req.signature,
    };

    const createdPaymentClause = new PaymentClauseModel(paymentClause);
    await createdPaymentClause.save();
    return res.send({ statusCode: 200, message: messages.created, paymentClause });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = PaymentClauseModel.find();
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
    const countQuery = PaymentClauseModel.estimatedDocumentCount();
    const [paymentClauses, count] = await Promise.all([query, countQuery]);
    const mappedPaymentClauses = paymentClauses.map(
      item => ({
        ...item.toObject(),
        constant: { value: item.constant, label: basicAttributes[item.constant.toString()] },
      }),
    );
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      paymentClauses: mappedPaymentClauses,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let paymentClause = await PaymentClauseModel.findById(id);
    if (populate === '1') {
      paymentClause = {
        ...paymentClause.toObject(),
        constant: {
          value: paymentClause.constant,
          label: basicAttributes[paymentClause.constant.toString()],
        },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      paymentClause,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const paymentClause = await PaymentClauseModel.findOneAndDelete({ _id: id });
    const deletedPaymentClause = new DeletedPaymentClauseModel(paymentClause.toObject());
    await deletedPaymentClause.save();
    return res.send({ statusCode: 200, message: messages.deleted, paymentClause });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.PaymentClauseSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name, constant } = req.body;
    const newPaymentClause = {
      name: htmlEscape(name),
      signature: req.signature,
      constant,
    };
    const paymentClause = await PaymentClauseModel
      .findByIdAndUpdate(id, {
        $set: {
          ...newPaymentClause,
        },
      });
    const logPaymentClause = new LogPaymentClauseModel({
      _id: new mongoose.Types.ObjectId(),
      paymentClause: paymentClause.toObject(),
      message: `Updating Payment Clause to ${JSON.stringify(newPaymentClause)}`,
      signature: req.signature,
    });
    await logPaymentClause.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      paymentClause: newPaymentClause,
    });
  }
}

module.exports = PaymentClauseController;
