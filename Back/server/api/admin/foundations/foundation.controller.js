const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const FoundationModel = require('./foundation.model').Foundation;
const DeletedFoundationModel = require('./foundation.model').DeletedFoundation;
const LogFoundationModel = require('./foundation.model').LogFoundation;

const schemas = require('./foundation.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong Foundation Input',
  created: 'تم حفظ المؤسسة بنجاح|Foundation created successfully',
  updated: 'تم تعديل المؤسسة بنجاح|Foundation updated successfully',
  deleted: 'تم حذف المؤسسة بنجاح|Foundation deleted successfully',
  foundAll: 'تم العثور على المؤسسات بنجاح|Foundations found successfully',
  foundOne: 'تم العثور على المؤسسة بنجاح|Foundation found successfully',
  hasChildrenError: 'لا يمكن حذف المؤسسة لوجود مؤسسات تندرج أسفلها|Failed To Delete the foundation as it has child nodes',
};

class FoundationController {
  static async getFoundations(options = {}) {
    const {
      parent,
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    const conditions = {
      parent,
    };
    let query = FoundationModel.find(conditions);
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
    const countQuery = FoundationModel.countDocuments(conditions);
    const [foundations, count] = await Promise.all([query, countQuery]);
    const mappedFoundations = foundations.map(
      item => ({
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      }),
    );
    return { foundations: mappedFoundations, count };
  }

  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.foundationSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      arName,
      enName,
      active,
      parent,
    } = req.body;

    const foundationId = new mongoose.Types.ObjectId();
    let parentFoundation;
    if (parent) {
      parentFoundation = await FoundationModel.findById(parent);
    }
    const escapedArName = htmlEscape(arName);
    const escapedEnName = htmlEscape(enName);
    const escapedParent = parent ? htmlEscape(parent) : null;
    const parentTotalId = parentFoundation && parentFoundation.parentTotalId
      ? `${parentFoundation.parentTotalId}.${escapedParent}` : escapedParent;
    const foundation = {
      _id: foundationId,
      arName: escapedArName,
      enName: escapedEnName,
      parent: escapedParent,
      childrenCount: 0,
      signature: req.signature,
      parentTotalId,
      active,
    };
    const createdFoundation = new FoundationModel(foundation);
    const promiseQueue = [
      createdFoundation.save(),
    ];
    if (parentFoundation) {
      parentFoundation.childrenCount += 1;
      promiseQueue.push(
        parentFoundation.save(),
      );
    }
    await Promise.all(promiseQueue);
    return res.send({ statusCode: 200, message: messages.created, foundation });
  }

  static async index(req, res) {
    const { foundations, count } = await FoundationController.getFoundations(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      foundations,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = FoundationModel.findById(id);
    if (populate === '1') {
      query = query.populate('parent');
    }
    let foundation = await query;
    if (populate === '1') {
      foundation = {
        ...foundation.toObject(),
        active: {
          value: foundation.active,
          label: basicAttributes[foundation.active.toString()],
        },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      foundation,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const foundation = await FoundationModel.findById(id);
    if (foundation.childrenCount > 0) {
      throw new AppError(500, messages.hasChildrenError, null, true);
    }
    const promiseQueue = [
      foundation.delete(),
    ];
    if (foundation.parent) {
      promiseQueue.push(
        FoundationModel.findByIdAndUpdate(foundation.parent, {
          $inc: {
            childrenCount: -1,
          },
        }),
      );
    }
    const deletedFoundation = new DeletedFoundationModel(foundation.toObject());
    promiseQueue.push(deletedFoundation.save());
    await Promise.all(promiseQueue);
    return res.send({ statusCode: 200, message: messages.deleted, foundation });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.foundationSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      arName,
      enName,
      active,
    } = req.body;
    const escapedArName = htmlEscape(arName);
    const escapedEnName = htmlEscape(enName);
    const newFoundation = {
      arName: escapedArName,
      enName: escapedEnName,
      signature: req.signature,
      active,
    };
    const foundation = await FoundationModel.findByIdAndUpdate(id, {
      $set: {
        ...newFoundation,
      },
    });
    const logFoundation = new LogFoundationModel({
      _id: new mongoose.Types.ObjectId(),
      foundation: foundation.toObject(),
      message: `Updating Foundation to ${JSON.stringify(newFoundation)}`,
      signature: req.signature,
    });
    await logFoundation.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      foundation: {
        ...foundation.toObject(),
        ...newFoundation,
      },
    });
  }
}

module.exports = FoundationController;
