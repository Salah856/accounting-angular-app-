const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ItemTypeModel = require('./item-type.model').ItemType;
const DeletedItemTypeModel = require('./item-type.model').DeletedItemType;
const LogItemTypeModel = require('./item-type.model').LogItemType;
const schemas = require('./item-type.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ نوع الصنف بنجاح|Item type created successfully',
  updated: 'تم تعديل نوع الصنف بنجاح|Item type updated successfully',
  deleted: 'تم حذف نوع الصنف بنجاح|Item type deleted successfully',
  foundAll: 'تم العثور على أنواع الصنف بنجاح|Item types found successfully',
  foundOne: 'تم العثور على نوع الصنف بنجاح|Item type found successfully',
};

class ItemTypeController {
  static async getItemTypes(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = ItemTypeModel.find();
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
    const countQuery = ItemTypeModel.estimatedDocumentCount();
    const [itemTypes, count] = await Promise.all([query, countQuery]);
    return { itemTypes, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemTypeSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name } = req.body;
    const itemType = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      signature: req.signature,
    };

    const createdItemType = new ItemTypeModel(itemType);
    await createdItemType.save();
    return res.send({ statusCode: 200, message: messages.created, itemType });
  }

  static async index(req, res) {
    const { itemTypes, count } = await ItemTypeController.getItemTypes(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      itemTypes,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const itemType = await ItemTypeModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      itemType,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const itemType = await ItemTypeModel.findOneAndDelete({ _id: id });
    const deletedItemType = new DeletedItemTypeModel(itemType.toObject());
    await deletedItemType.save();
    return res.send({ statusCode: 200, message: messages.deleted, itemType });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemTypeSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name } = req.body;
    const newItemType = {
      name: htmlEscape(name),
      signature: req.signature,
    };
    const itemType = await ItemTypeModel
      .findByIdAndUpdate(id,
        {
          $set: {
            ...newItemType,
          },
        });
    const logItemType = new LogItemTypeModel({
      _id: new mongoose.Types.ObjectId(),
      itemType: itemType.toObject(),
      message: `Updating Item Type to ${JSON.stringify(newItemType)}`,
      signature: req.signature,
    });
    await logItemType.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      itemType: newItemType,
    });
  }
}

module.exports = ItemTypeController;
