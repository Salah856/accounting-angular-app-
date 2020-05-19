const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const AddingPermissionModel = require('./adding-permission.model').AddingPermission;
const DeletedAddingPermissionModel = require('./adding-permission.model').DeletedAddingPermission;
const LogAddingPermissionModel = require('./adding-permission.model').LogAddingPermission;

const schemas = require('./adding-permission.schema');
const AppError = require('../../../utils/app-error');
// const basicAttributes = require('../../../utils/basic-attributes');
const { storeEventBus } = require('../../basic-data/stores');
const { itemEventBus } = require('../../basic-data/items');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ اذن الاضافة بنجاح|Adding Permission created successfully',
  updated: 'تم تعديل اذن الاضافة بنجاح|Adding Permission updated successfully',
  deleted: 'تم حذف اذن الاضافة بنجاح|Adding Permission deleted successfully',
  foundAll: 'تم العثور على أذون الاضافة بنجاح|Adding Permissions found successfully',
  foundOne: 'تم العثور على اذن الاضافة بنجاح|Adding Permission found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',
};

class AddingPermissionController {
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
    const validationResult = Joi.validate(data.permission, schemas.addingPermissionSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      date,
      store,
      addedItems,
      notes,
      storeSecretary,
    } = data.permission;
    const addingPermission = {
      _id: new mongoose.Types.ObjectId(),
      date: htmlEscape(date),
      store: htmlEscape(store),
      notes: htmlEscape(notes),
      storeSecretary: htmlEscape(storeSecretary),
      addedItems: addedItems.map(addedItem => ({
        item: htmlEscape(addedItem.item),
        quantity: parseInt(htmlEscape(addedItem.quantity), 10),
      })),
      signature: data.signature,
    };
    const createdAddingPermission = new AddingPermissionModel(addingPermission);
    await createdAddingPermission.save();
    return addingPermission;
  }

  static async create(req, res) {
    const addingPermission = await AddingPermissionController.createPermission({
      permission: req.body,
      signature: req.signature,
    });
    return res.send({ statusCode: 200, message: messages.created, addingPermission });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = AddingPermissionModel.find().populate('store');
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
    const countQuery = AddingPermissionModel.estimatedDocumentCount();
    const [addingPermissions, count] = await Promise.all([query, countQuery]);
    const mappedAddingPermissions = addingPermissions
      .map(addingPermission => addingPermission.toObject());
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      addingPermissions: mappedAddingPermissions,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = AddingPermissionModel.findById(id);
    if (populate === '1') {
      query = query.populate(['store', 'addedItems.item']);
    }
    const addingPermission = await query;
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      addingPermission,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const addingPermission = await AddingPermissionModel.findOneAndDelete({ _id: id });
    const deletedAddingPermission = new DeletedAddingPermissionModel(addingPermission.toObject());
    await deletedAddingPermission.save();
    return res.send({ statusCode: 200, message: messages.deleted, addingPermission });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.addingPermissionSchema);
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
    const newAddingPermission = {
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
    const addingPermission = await AddingPermissionModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newAddingPermission,
          },
        });
    const logAddingPermission = new LogAddingPermissionModel({
      _id: new mongoose.Types.ObjectId(),
      addingPermission: addingPermission.toObject(),
      message: `Updating Adding Permission to ${JSON.stringify(newAddingPermission)}`,
      signature: req.signature,
    });
    await logAddingPermission.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      addingPermission: newAddingPermission,
    });
  }
}

module.exports = AddingPermissionController;
