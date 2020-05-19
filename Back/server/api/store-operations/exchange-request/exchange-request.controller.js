const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ExchangeRequestModel = require('./exchange-request.model').ExchangeRequest;
const DeletedExchangeRequestModel = require('./exchange-request.model').DeletedExchangeRequest;
const LogExchangeRequestModel = require('./exchange-request.model').LogExchangeRequest;

const schemas = require('./exchange-request.schema');
const AppError = require('../../../utils/app-error');
// const basicAttributes = require('../../../utils/basic-attributes');
const { storeEventBus } = require('../../basic-data/stores');
const { itemEventBus } = require('../../basic-data/items');
const { exchangePermissionEventBus } = require('../exchange-permission');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ طلب الصرف بنجاح|Exchange Request created successfully',
  updated: 'تم تعديل طلب الصرف بنجاح|Exchange Request updated successfully',
  deleted: 'تم حذف طلب الصرف بنجاح|Exchange Request deleted successfully',
  foundAll: 'تم العثور على طلبات الصرف بنجاح|Exchange Requests found successfully',
  foundOne: 'تم العثور على طلب الصرف بنجاح|Exchange Request found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',
  convertedToPermission: 'تم تحويل طلب الصرف بنجاح|Exchange Request Converted successfully',
};

class ExchangeRequestController {
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

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.exchangeRequestSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      date,
      store,
      exchangedItems,
      notes,
      storeSecretary,
    } = req.body;
    const exchangeRequest = {
      _id: new mongoose.Types.ObjectId(),
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
    const createdExchangeRequest = new ExchangeRequestModel(exchangeRequest);
    await createdExchangeRequest.save();
    return res.send({ statusCode: 200, message: messages.created, exchangeRequest });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = ExchangeRequestModel.find().populate('store');
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
    const countQuery = ExchangeRequestModel.estimatedDocumentCount();
    const [exchangeRequests, count] = await Promise.all([query, countQuery]);
    const mappedExchangeRequests = exchangeRequests
      .map(exchangeRequest => exchangeRequest.toObject());
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      exchangeRequests: mappedExchangeRequests,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = ExchangeRequestModel.findById(id);
    if (populate === '1') {
      query = query.populate(['store', 'exchangedItems.item']);
    }
    const exchangeRequest = await query;
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      exchangeRequest,
    });
  }

  static async convertToPermission(req, res) {
    const { id } = req.params;
    const exchangeRequest = await ExchangeRequestModel.findById(id, [
      'date', 'store', 'notes', 'storeSecretary', 'exchangedItems',
    ]);
    const exchangeRequestObject = exchangeRequest.toObject();
    // eslint-disable-next-line no-underscore-dangle
    delete exchangeRequestObject._id;
    await exchangePermissionEventBus.emit('createExchangePermission', {
      permission: {
        ...exchangeRequestObject,
        store: exchangeRequest.store.toString(),
        exchangedItems: exchangeRequest.exchangedItems
          .map(exchangedItem => ({
            ...exchangedItem.toObject(),
            item: exchangedItem.item.toString(),
          })),
      },
      signature: req.signature,
    });
    await ExchangeRequestController.deleteExchangeRequest(id);
    return res.send({ statusCode: 200, message: messages.convertedToPermission, exchangeRequest });
  }

  static async deleteExchangeRequest(id) {
    const exchangeRequest = await ExchangeRequestModel.findOneAndDelete({ _id: id });
    const deletedExchangeRequest = new DeletedExchangeRequestModel(
      exchangeRequest.toObject(),
    );
    await deletedExchangeRequest.save();
    return exchangeRequest;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const exchangeRequest = await ExchangeRequestController.deleteExchangeRequest(id);
    return res.send({ statusCode: 200, message: messages.deleted, exchangeRequest });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.exchangeRequestSchema);
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
    const newExchangeRequest = {
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
    const exchangeRequest = await ExchangeRequestModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newExchangeRequest,
          },
        });
    const logExchangeRequest = new LogExchangeRequestModel({
      _id: new mongoose.Types.ObjectId(),
      exchangeRequest: exchangeRequest.toObject(),
      message: `Updating Exchange Request to ${JSON.stringify(newExchangeRequest)}`,
      signature: req.signature,
    });
    await logExchangeRequest.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      exchangeRequest: newExchangeRequest,
    });
  }
}

module.exports = ExchangeRequestController;
