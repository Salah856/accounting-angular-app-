const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ItemUnitModel = require('./item-unit.model').ItemUnit;
const DeletedItemUnitModel = require('./item-unit.model').DeletedItemUnit;
const LogItemUnitModel = require('./item-unit.model').LogItemUnit;
const schemas = require('./item-unit.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الوحدة بنجاح|Unit created successfully',
  updated: 'تم تعديل الوحدة بنجاح|Unit updated successfully',
  deleted: 'تم حذف الوحدة بنجاح|Unit deleted successfully',
  foundAll: 'تم العثور على الوحدات بنجاح|Units found successfully',
  foundOne: 'تم العثور على الوحدة بنجاح|Unit found successfully',
};

class ItemUnitController {
  static async getItemUnits(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = ItemUnitModel.find();
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
    const countQuery = ItemUnitModel.estimatedDocumentCount();
    const [itemUnits, count] = await Promise.all([query, countQuery]);
    return { itemUnits, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemUnitSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name, numberOfItems } = req.body;
    const itemUnit = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      signature: req.signature,
      numberOfItems: numberOfItems ? parseInt(htmlEscape(numberOfItems), 10) : null,
    };
    const createdItemUnit = new ItemUnitModel(itemUnit);
    await createdItemUnit.save();
    return res.send({ statusCode: 200, message: messages.created, itemUnit });
  }

  static async index(req, res) {
    const { itemUnits, count } = await ItemUnitController.getItemUnits(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      itemUnits,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const itemUnit = await ItemUnitModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      itemUnit,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const itemUnit = await ItemUnitModel.findOneAndDelete({ _id: id });
    const deletedItemUnit = new DeletedItemUnitModel(itemUnit.toObject());
    await deletedItemUnit.save();
    return res.send({ statusCode: 200, message: messages.deleted, itemUnit });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemUnitSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name, numberOfItems } = req.body;
    const newItemUnit = {
      name: htmlEscape(name),
      numberOfItems: numberOfItems ? parseInt(htmlEscape(numberOfItems), 10) : null,
      signature: req.signature,
    };
    const itemUnit = await ItemUnitModel.findByIdAndUpdate(id,
      {
        $set: {
          ...newItemUnit,
        },
      });
    const logItemUnit = new LogItemUnitModel({
      _id: new mongoose.Types.ObjectId(),
      itemUnit: itemUnit.toObject(),
      message: `Updating Item Unit to ${JSON.stringify(newItemUnit)}`,
      signature: req.signature,
    });
    await logItemUnit.save();
    return res.send({ statusCode: 200, message: messages.updated, itemUnit: newItemUnit });
  }
}

module.exports = ItemUnitController;
