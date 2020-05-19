const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const TreasuryModel = require('./treasury.model').Treasury;
const DeletedTreasuryModel = require('./treasury.model').DeletedTreasury;
const LogTreasuryModel = require('./treasury.model').LogTreasury;

const schemas = require('./treasury.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');
const { currencyEventBus } = require('../currencies');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الخزينة بنجاح|Treasury created successfully',
  updated: 'تم تعديل الخزينة بنجاح|Treasury updated successfully',
  deleted: 'تم حذف الخزينة بنجاح|Treasury deleted successfully',
  foundAll: 'تم العثور على الخزائن بنجاح|Treasuries found successfully',
  foundOne: 'تم العثور على الخزينة بنجاح|Treasury found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',

};

class TreasuryController {
  static async options(req, res) {
    const options = await currencyEventBus.emit('getCurrencies');
    delete options.count;
    return res.send({ statusCode: 200, message: messages.foundOptions, options });
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.treasurySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      name,
      active,
      createdAt,
      openingBalance,
      currentBalance,
      currency,
    } = req.body;
    const treasury = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      createdAt: htmlEscape(createdAt),
      openingBalance: parseFloat(htmlEscape(openingBalance), 10),
      currentBalance: parseFloat(htmlEscape(currentBalance), 10),
      currency: htmlEscape(currency),
      signature: req.signature,
      active,
    };

    const createdTreasury = new TreasuryModel(treasury);
    await createdTreasury.save();
    return res.send({ statusCode: 200, message: messages.created, treasury });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = TreasuryModel.find();
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
    const countQuery = TreasuryModel.estimatedDocumentCount();
    const [treasuries, count] = await Promise.all([query, countQuery]);
    const mappedTreasuries = treasuries.map(
      item => ({
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      }),
    );
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      treasuries: mappedTreasuries,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = TreasuryModel.findById(id);
    if (populate === '1') {
      query = query.populate('currency');
    }
    let treasury = await query;
    if (populate === '1') {
      treasury = {
        ...treasury.toObject(),
        active: { value: treasury.active, label: basicAttributes[treasury.active.toString()] },

      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      treasury,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const treasury = await TreasuryModel.findOneAndDelete({ _id: id });
    const deletedTreasury = new DeletedTreasuryModel(treasury.toObject());
    await deletedTreasury.save();
    return res.send({ statusCode: 200, message: messages.deleted, treasury });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.treasurySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      name,
      active,
      createdAt,
      openingBalance,
      currentBalance,
      currency,
    } = req.body;
    const newTreasury = {
      name: htmlEscape(name),
      createdAt: htmlEscape(createdAt),
      openingBalance: parseFloat(htmlEscape(openingBalance), 10),
      currentBalance: parseFloat(htmlEscape(currentBalance), 10),
      currency: htmlEscape(currency),
      signature: req.signature,
      active,
    };
    const treasury = await TreasuryModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newTreasury,
          },
        });
    const logTreasury = new LogTreasuryModel({
      _id: new mongoose.Types.ObjectId(),
      treasury: treasury.toObject(),
      message: `Updating Treasury to ${JSON.stringify(newTreasury)}`,
      signature: req.signature,
    });
    await logTreasury.save();
    return res.send({ statusCode: 200, message: messages.updated, treasury: newTreasury });
  }
}

module.exports = TreasuryController;
