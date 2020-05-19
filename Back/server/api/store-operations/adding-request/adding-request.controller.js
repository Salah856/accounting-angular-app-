const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const AddingRequestModel = require('./adding-request.model').AddingRequest;
const DeletedAddingRequestModel = require('./adding-request.model').DeletedAddingRequest;
const LogAddingRequestModel = require('./adding-request.model').LogAddingRequest;
const { addingPermissionEventBus } = require('../adding-permission');
const schemas = require('./adding-request.schema');
const AppError = require('../../../utils/app-error');
// const basicAttributes = require('../../../utils/basic-attributes');
const { storeEventBus } = require('../../basic-data/stores');
const { itemEventBus } = require('../../basic-data/items');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ طلب الاضافة بنجاح|Adding Request created successfully',
  updated: 'تم تعديل طلب الاضافة بنجاح|Adding Request updated successfully',
  deleted: 'تم حذف طلب الاضافة بنجاح|Adding Request deleted successfully',
  foundAll: 'تم العثور على طلبات الاضافة بنجاح|Adding Requests found successfully',
  foundOne: 'تم العثور على طلب الاضافة بنجاح|Adding Request found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',
  convertedToPermission: 'تم تحويل طلب الاضافة بنجاح|Adding Request Converted successfully',
};

class AddingRequestController {
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

  static async convertToPermission(req, res) {
    const { id } = req.params;
    const addingRequest = await AddingRequestModel.findById(id, [
      'date', 'store', 'notes', 'storeSecretary', 'addedItems',
    ]);
    const addingRequestObject = addingRequest.toObject();
    // eslint-disable-next-line no-underscore-dangle
    delete addingRequestObject._id;
    await addingPermissionEventBus.emit('createAddingPermission', {
      permission: {
        ...addingRequestObject,
        store: addingRequest.store.toString(),
        addedItems: addingRequest.addedItems
          .map(addedItem => ({ ...addedItem.toObject(), item: addedItem.item.toString() })),
      },
      signature: req.signature,
    });
    await AddingRequestController.deleteAddingRequest(id);
    return res.send({ statusCode: 200, message: messages.convertedToPermission, addingRequest });
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.addingRequestSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      date,
      store,
      addedItems,
      notes,
      storeSecretary,
    } = req.body;
    const addingRequest = {
      _id: new mongoose.Types.ObjectId(),
      date: htmlEscape(date),
      store: htmlEscape(store),
      notes: htmlEscape(notes),
      storeSecretary: htmlEscape(storeSecretary),
      addedItems: addedItems.map(addedItem => ({
        item: htmlEscape(addedItem.item),
        quantity: parseInt(htmlEscape(addedItem.quantity), 10),
      })),
      signature: req.signature,
    };
    const createdAddingRequest = new AddingRequestModel(addingRequest);
    await createdAddingRequest.save();
    return res.send({ statusCode: 200, message: messages.created, addingRequest });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = AddingRequestModel.find().populate('store');
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
    const countQuery = AddingRequestModel.estimatedDocumentCount();
    const [addingRequests, count] = await Promise.all([query, countQuery]);
    const mappedAddingRequests = addingRequests
      .map(addingRequest => addingRequest.toObject());
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      addingRequests: mappedAddingRequests,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = AddingRequestModel.findById(id);
    if (populate === '1') {
      query = query.populate(['store', 'addedItems.item']);
    }
    const addingRequest = await query;
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      addingRequest,
    });
  }

  static async deleteAddingRequest(id) {
    const addingRequest = await AddingRequestModel.findOneAndDelete({ _id: id });
    const deletedAddingRequest = new DeletedAddingRequestModel(addingRequest.toObject());
    await deletedAddingRequest.save();
    return addingRequest;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const addingRequest = await AddingRequestController.deleteAddingRequest(id);
    return res.send({ statusCode: 200, message: messages.deleted, addingRequest });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.addingRequestSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      date,
      store,
      addedItems,
      notes,
      storeSecretary,
    } = req.body;
    const newAddingRequest = {
      date: htmlEscape(date),
      store: htmlEscape(store),
      notes: htmlEscape(notes),
      storeSecretary: htmlEscape(storeSecretary),
      addedItems: addedItems.map(addedItem => ({
        item: htmlEscape(addedItem.item),
        quantity: parseInt(htmlEscape(addedItem.quantity), 10),
      })),
      signature: req.signature,
    };
    const addingRequest = await AddingRequestModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newAddingRequest,
          },
        });
    const logAddingRequest = new LogAddingRequestModel({
      _id: new mongoose.Types.ObjectId(),
      addingRequest: addingRequest.toObject(),
      message: `Updating Adding Request to ${JSON.stringify(newAddingRequest)}`,
      signature: req.signature,
    });
    await logAddingRequest.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      addingRequest: newAddingRequest,
    });
  }
}

module.exports = AddingRequestController;
