const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ExchangePermissionModel = require('./exchange-permission.model').ExchangePermission;
const DeletedExchangePermissionModel = require('./exchange-permission.model').DeletedExchangePermission;
const LogExchangePermissionModel = require('./exchange-permission.model').LogExchangePermission;

const schemas = require('./exchange-permission.schema');
const AppError = require('../../../utils/app-error');
// const basicAttributes = require('../../../utils/basic-attributes');
const { storeEventBus } = require('../../basic-data/stores');
const { itemEventBus } = require('../../basic-data/items');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ اذن الصرف بنجاح|Exchange Permission created successfully',
  updated: 'تم تعديل اذن الصرف بنجاح|Exchange Permission updated successfully',
  deleted: 'تم حذف اذن الصرف بنجاح|Exchange Permission deleted successfully',
  foundAll: 'تم العثور على أذون الصرف بنجاح|Exchange Permissions found successfully',
  foundOne: 'تم العثور على اذن الصرف بنجاح|Exchange Permission found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',
};

class ExchangePermissionController {
  static async options(req, res) {
    const queries = [
      itemEventBus.emit('getItems'),
      storeEventBus.emit('getStores'),
    ];
    const [
      items,
      stores,
    ] = await Promise.all(queries);
    const options = {
      ...items,
      ...stores,
    };
    delete options.count;
    return res.send({ statusCode: 200, message: messages.foundOptions, options });
  }

  static async createPermission(data) {
    const validationResult = Joi.validate(data.permission, schemas.exchangePermissionSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      date,
      store,
      exchangedItems,
      notes,
      storeSecretary,
    } = data.permission;
    const exchangePermission = {
      _id: new mongoose.Types.ObjectId(),
      date: htmlEscape(date),
      store: htmlEscape(store),
      notes: htmlEscape(notes),
      storeSecretary: htmlEscape(storeSecretary),
      exchangedItems: exchangedItems.map(exchangedItem => ({
        item: htmlEscape(exchangedItem.item),
        quantity: parseInt(htmlEscape(exchangedItem.quantity), 10),
      })),
      signature: data.signature,
    };
    const createdExchangePermission = new ExchangePermissionModel(exchangePermission);
    await createdExchangePermission.save();
    return exchangePermission;
  }

  static async create(req, res) {
    const exchangePermission = ExchangePermissionController.createPermission({
      permission: req.body,
      signature: req.signature,
    });
    return res.send({ statusCode: 200, message: messages.created, exchangePermission });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = ExchangePermissionModel.find().populate('store');
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
    const countQuery = ExchangePermissionModel.estimatedDocumentCount();
    const [exchangePermissions, count] = await Promise.all([query, countQuery]);
    const mappedExchangePermissions = exchangePermissions
      .map(exchangePermission => exchangePermission.toObject());
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      exchangePermissions: mappedExchangePermissions,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = ExchangePermissionModel.findById(id);
    if (populate === '1') {
      query = query.populate(['store', 'exchangedItems.item']);
    }
    const exchangePermission = await query;
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      exchangePermission,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const exchangePermission = await ExchangePermissionModel.findOneAndDelete({ _id: id });
    const deletedExchangePermission = new DeletedExchangePermissionModel(
      exchangePermission.toObject(),
    );
    await deletedExchangePermission.save();
    return res.send({ statusCode: 200, message: messages.deleted, exchangePermission });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.exchangePermissionSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      date,
      store,
      exchangedItems,
      notes,
      storeSecretary,
    } = req.body;
    const newExchangePermission = {
      date: htmlEscape(date),
      store: htmlEscape(store),
      notes: htmlEscape(notes),
      storeSecretary: htmlEscape(storeSecretary),
      exchangedItems: exchangedItems.map(exchangedItem => ({
        item: htmlEscape(exchangedItem.item),
        quantity: parseInt(htmlEscape(exchangedItem.quantity), 10),
      })),
      signature: req.signature,
    };
    const exchangePermission = await ExchangePermissionModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newExchangePermission,
          },
        });
    const logExchangePermission = new LogExchangePermissionModel({
      _id: new mongoose.Types.ObjectId(),
      exchangePermission: exchangePermission.toObject(),
      message: `Updating Exchange Permission to ${JSON.stringify(newExchangePermission)}`,
      signature: req.signature,
    });
    await logExchangePermission.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      exchangePermission: newExchangePermission,
    });
  }
}

module.exports = ExchangePermissionController;
