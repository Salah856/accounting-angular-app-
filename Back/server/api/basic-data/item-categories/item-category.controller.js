const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const ItemCategoryModel = require('./item-category.model').ItemCategory;
const DeletedItemCategoryModel = require('./item-category.model').DeletedItemCategory;
const LogItemCategoryModel = require('./item-category.model').LogItemCategory;
const schemas = require('./item-category.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ التصنيف بنجاح|Category created successfully',
  updated: 'تم تعديل التصنيف بنجاح|Category updated successfully',
  deleted: 'تم حذف التصنيف بنجاح|Category deleted successfully',
  foundAll: 'تم العثور على التصنيفات بنجاح|Categories found successfully',
  foundOne: 'تم العثور على التصنيف بنجاح|Category found successfully',
};

class ItemCategoryController {
  static async getItemCategories(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = ItemCategoryModel.find();
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
    const countQuery = ItemCategoryModel.estimatedDocumentCount();
    const [itemCategories, count] = await Promise.all([query, countQuery]);
    return { itemCategories, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemCategorySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name } = req.body;
    const itemCategory = {
      _id: new mongoose.Types.ObjectId(),
      name: htmlEscape(name),
      signature: req.signature,
    };

    const createdItemCategory = new ItemCategoryModel(itemCategory);
    await createdItemCategory.save();
    return res.send({ statusCode: 200, message: messages.created, itemCategory });
  }

  static async index(req, res) {
    const { itemCategories, count } = await ItemCategoryController.getItemCategories(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      itemCategories,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const itemCategory = await ItemCategoryModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      itemCategory,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const itemCategory = await ItemCategoryModel.findOneAndDelete({ _id: id });
    const deletedItemCategory = new DeletedItemCategoryModel(itemCategory.toObject());
    await deletedItemCategory.save();
    return res.send({ statusCode: 200, message: messages.deleted, itemCategory });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.itemCategorySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name } = req.body;
    const newItemCategory = {
      name: htmlEscape(name),
      signature: req.signature,
    };
    const itemCategory = await ItemCategoryModel
      .findByIdAndUpdate(id, {
        $set: {
          ...newItemCategory,
        },
      });
    const logItemCategory = new LogItemCategoryModel({
      _id: new mongoose.Types.ObjectId(),
      itemCategory: itemCategory.toObject(),
      message: `Updating Item Category to ${JSON.stringify(newItemCategory)}`,
      signature: req.signature,
    });
    await logItemCategory.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      itemCategory: newItemCategory,
    });
  }
}

module.exports = ItemCategoryController;
