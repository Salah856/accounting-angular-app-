const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const CurrencyModel = require('./currency.model').Currency;
const DeletedCurrencyModel = require('./currency.model').DeletedCurrency;
const LogCurrencyModel = require('./currency.model').LogCurrency;

const schemas = require('./currency.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ العملة بنجاح|Currency created successfully',
  updated: 'تم تعديل العملة بنجاح|Currency updated successfully',
  deleted: 'تم حذف العملة بنجاح|Currency deleted successfully',
  foundAll: 'تم العثور على العملات بنجاح|Currencies found successfully',
  foundOne: 'تم العثور على العملة بنجاح|Currency found successfully',
};

class CurrencyController {
  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.currencySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name, symbol } = req.body;
    const currency = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      symbol: htmlEscape(symbol),
      signature: req.signature,
    };

    const createdCurrency = new CurrencyModel(currency);
    await createdCurrency.save();
    return res.send({ statusCode: 200, message: messages.created, currency });
  }

  static async getCurrencies(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = CurrencyModel.find();
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
    const countQuery = CurrencyModel.estimatedDocumentCount();
    const [currencies, count] = await Promise.all([query, countQuery]);
    return { currencies, count };
  }

  static async index(req, res) {
    const { currencies, count } = await CurrencyController.getCurrencies(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      currencies,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const currency = await CurrencyModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      currency,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const currency = await CurrencyModel.findOneAndDelete({ _id: id });
    const deletedCurrency = new DeletedCurrencyModel(currency.toObject());
    await deletedCurrency.save();
    return res.send({ statusCode: 200, message: messages.deleted, currency });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.currencySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name, symbol } = req.body;
    const newCurrency = {
      name: htmlEscape(name),
      symbol: htmlEscape(symbol),
      signature: req.signature,
    };
    const currency = await CurrencyModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newCurrency,
          },
        });
    const logCurrency = new LogCurrencyModel({
      _id: new mongoose.Types.ObjectId(),
      currency: currency.toObject(),
      message: `Updating Currency to ${JSON.stringify(newCurrency)}`,
      signature: req.signature,
    });
    await logCurrency.save();
    return res.send({ statusCode: 200, message: messages.updated, currency: newCurrency });
  }
}

module.exports = CurrencyController;
