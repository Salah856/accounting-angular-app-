const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ItemModel = require('./item.model').Item;
const DeletedItemModel = require('./item.model').DeletedItem;
const LogItemModel = require('./item.model').LogItem;

const schemas = require('./item.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');
const { companyEventBus } = require('../companies');
const { itemCategoryEventBus } = require('../item-categories');
const { itemTypeEventBus } = require('../item-types');
const { itemUnitEventBus } = require('../item-units');
const { currencyEventBus } = require('../currencies');


const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الصنف بنجاح|Item created successfully',
  updated: 'تم تعديل الصنف بنجاح|Item updated successfully',
  deleted: 'تم حذف الصنف بنجاح|Item deleted successfully',
  foundAll: 'تم العثور على الأصناف بنجاح|Items found successfully',
  foundOne: 'تم العثور على الصنف بنجاح|Item found successfully',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',
};

class ItemController {
  static async getItems(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = ItemModel.find();
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
    const countQuery = ItemModel.estimatedDocumentCount();
    const [items, count] = await Promise.all([query, countQuery]);
    const mappedItems = items.map(
      item => ({
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      }),
    );
    return { items: mappedItems, count };
  }

  static async options(req, res) {
    const queries = [
      companyEventBus.emit('getCompanies'),
      itemCategoryEventBus.emit('getItemCategories'),
      itemTypeEventBus.emit('getItemTypes'),
      itemUnitEventBus.emit('getItemUnits'),
      currencyEventBus.emit('getCurrencies'),
    ];
    const [
      companies,
      itemCategories,
      itemTypes,
      itemUnits,
      currencies,
    ] = await Promise.all(queries);
    const options = {
      ...companies,
      ...itemCategories,
      ...itemTypes,
      ...itemUnits,
      ...currencies,
    };
    delete options.count;
    return res.send({ statusCode: 200, message: messages.foundOptions, options });
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      name,
      barcode,
      unit,
      category,
      type,
      company,
      currency,
      active,
      purchasePrice,
      sellingPrice,
      wholesalePrice,
      defectivePrice,
    } = req.body;
    const item = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      barcode: htmlEscape(barcode),
      unit: htmlEscape(unit),
      category: htmlEscape(category),
      type: htmlEscape(type),
      company: htmlEscape(company),
      currency: htmlEscape(currency),
      purchasePrice: parseFloat(htmlEscape(purchasePrice), 10),
      sellingPrice: parseFloat(htmlEscape(sellingPrice), 10),
      wholesalePrice: parseFloat(htmlEscape(wholesalePrice), 10),
      defectivePrice: parseFloat(htmlEscape(defectivePrice), 10),
      signature: req.signature,
      active,
    };
    const createdItem = new ItemModel(item);
    await createdItem.save();
    return res.send({ statusCode: 200, message: messages.created, item });
  }

  static async index(req, res) {
    const { items, count } = await ItemController.getItems(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      items,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = ItemModel.findById(id);
    if (populate === '1') {
      query = query
        .populate('type').populate('category')
        .populate('unit').populate('company')
        .populate('currency');
    }
    let item = await query;
    if (populate === '1') {
      item = {
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      item,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const item = await ItemModel.findOneAndDelete({ _id: id });
    const deletedItem = new DeletedItemModel(item.toObject());
    await deletedItem.save();
    return res.send({ statusCode: 200, message: messages.deleted, item });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      name,
      barcode,
      unit,
      category,
      type,
      company,
      currency,
      active,
      purchasePrice,
      sellingPrice,
      wholesalePrice,
      defectivePrice,
    } = req.body;
    const newItem = {
      name: htmlEscape(name),
      barcode: htmlEscape(barcode),
      unit: htmlEscape(unit),
      category: htmlEscape(category),
      type: htmlEscape(type),
      company: htmlEscape(company),
      currency: htmlEscape(currency),
      purchasePrice: parseFloat(htmlEscape(purchasePrice), 10),
      sellingPrice: parseFloat(htmlEscape(sellingPrice), 10),
      wholesalePrice: parseFloat(htmlEscape(wholesalePrice), 10),
      defectivePrice: parseFloat(htmlEscape(defectivePrice), 10),
      signature: req.signature,
      active,
    };
    const item = await ItemModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newItem,
          },
        });
    const logItem = new LogItemModel({
      _id: new mongoose.Types.ObjectId(),
      item: item.toObject(),
      message: `Updating Item to ${JSON.stringify(newItem)}`,
      signature: req.signature,
    });
    await logItem.save();
    return res.send({ statusCode: 200, message: messages.updated, item: newItem });
  }
}

module.exports = ItemController;
