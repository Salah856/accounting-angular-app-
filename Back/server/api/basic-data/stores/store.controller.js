const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const StoreModel = require('./store.model').Store;
const DeletedStoreModel = require('./store.model').DeletedStore;
const LogStoreModel = require('./store.model').LogStore;

const schemas = require('./store.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ المخزن بنجاح|Store created successfully',
  updated: 'تم تعديل المخزن بنجاح|Store updated successfully',
  deleted: 'تم حذف المخزن بنجاح|Store deleted successfully',
  foundAll: 'تم العثور على المخازن بنجاح|Stores found successfully',
  foundOne: 'تم العثور على المخزن بنجاح|Store found successfully',
};

class StoreController {
  static async getStores(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = StoreModel.find();
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
    const countQuery = StoreModel.estimatedDocumentCount();
    const [stores, count] = await Promise.all([query, countQuery]);
    const mappedStores = stores.map(
      item => ({
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      }),
    );
    return { stores: mappedStores, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.storeSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      name,
      active,
      createdAt,
      phoneNumbers,
      email,
      fax,
      address,
      website,
    } = req.body;
    const store = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      createdAt: htmlEscape(createdAt),
      phoneNumbers: phoneNumbers ? phoneNumbers.map(item => htmlEscape(item)) : [],
      email: htmlEscape(email),
      fax: htmlEscape(fax),
      address: htmlEscape(address),
      website: htmlEscape(website),
      signature: req.signature,
      active,
    };

    const createdStore = new StoreModel(store);
    await createdStore.save();
    return res.send({ statusCode: 200, message: messages.created, store });
  }

  static async index(req, res) {
    const { stores, count } = await StoreController.getStores(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      stores,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let store = await StoreModel.findById(id);
    if (populate === '1') {
      store = {
        ...store.toObject(),
        active: { value: store.active, label: basicAttributes[store.active.toString()] },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      store,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const store = await StoreModel.findOneAndDelete({ _id: id });
    const deletedStore = new DeletedStoreModel(store.toObject());
    await deletedStore.save();
    return res.send({ statusCode: 200, message: messages.deleted, store });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.storeSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      name,
      active,
      createdAt,
      phoneNumbers,
      email,
      fax,
      address,
      website,
    } = req.body;
    const newStore = {
      name: htmlEscape(name),
      createdAt: htmlEscape(createdAt),
      phoneNumbers: phoneNumbers ? phoneNumbers.map(item => htmlEscape(item)) : [],
      email: htmlEscape(email),
      fax: htmlEscape(fax),
      address: htmlEscape(address),
      website: htmlEscape(website),
      signature: req.signature,
      active,
    };
    const store = await StoreModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newStore,
          },
        });
    const logStore = new LogStoreModel({
      _id: new mongoose.Types.ObjectId(),
      store: store.toObject(),
      message: `Updating Store to ${JSON.stringify(newStore)}`,
      signature: req.signature,
    });
    await logStore.save();
    return res.send({ statusCode: 200, message: messages.updated, store: newStore });
  }
}

module.exports = StoreController;
