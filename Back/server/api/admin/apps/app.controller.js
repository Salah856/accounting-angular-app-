const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const AppModel = require('./app.model').App;
const DeletedAppModel = require('./app.model').DeletedApp;
const LogAppModel = require('./app.model').LogApp;

const schemas = require('./app.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong App Input',
  created: 'تم حفظ التطبيق بنجاح|App created successfully',
  updated: 'تم تعديل التطبيق بنجاح|App updated successfully',
  deleted: 'تم حذف التطبيق بنجاح|App deleted successfully',
  foundAll: 'تم العثور على التطبيقات بنجاح|Apps found successfully',
  foundOne: 'تم العثور على التطبيق بنجاح|App found successfully',
  hasChildrenError: 'لا يمكن حذف التطبيق لوجود مؤسسات تندرج أسفلها|Failed To Delete the app as it has child nodes',
};

class AppController {
  static async create(req, res) {
    const validationResult = Joi.validate(req.body, schemas.appSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      arName,
      enName,
      apiRoute,
      scopeRequired,
      route,
      parent,
    } = req.body;

    const appId = new mongoose.Types.ObjectId();
    let parentApp;
    if (parent) {
      parentApp = await AppModel.findById(parent);
    }
    const escapedArName = htmlEscape(arName);
    const escapedEnName = htmlEscape(enName);
    const escapedRoute = htmlEscape(route);
    const escapedApiRoute = htmlEscape(apiRoute);
    const escapedParent = parent ? htmlEscape(parent) : null;
    const parentTotalId = parentApp && parentApp.parentTotalId
      ? `${parentApp.parentTotalId}.${escapedParent}` : escapedParent;
    const app = {
      _id: appId,
      arName: escapedArName,
      enName: escapedEnName,
      route: escapedRoute,
      apiRoute: escapedApiRoute,
      parent: escapedParent,
      childrenCount: 0,
      signature: req.signature,
      parentTotalId,
      scopeRequired,
    };
    const createdApp = new AppModel(app);
    const promiseQueue = [
      createdApp.save(),
    ];
    if (parentApp) {
      parentApp.childrenCount += 1;
      promiseQueue.push(
        parentApp.save(),
      );
    }
    await Promise.all(promiseQueue);
    return res.send({ statusCode: 200, message: messages.created, app });
  }

  static async getApps(options = {}) {
    const {
      parent,
      limit,
      skip,
      sortField,
      sortDirection,
      all,
    } = options;
    if (all === '1') {
      const allApps = await AppModel.find();
      const parentApps = allApps.filter(item => item.parent === null);
      const apps = parentApps.map(
        item => ({
          ...item.toObject(),
          children: allApps.filter(
            childItem => (
              // eslint-disable-next-line no-underscore-dangle
              childItem.parent ? childItem.parent.toString() === item._id.toString() : false
            ),
          ),
        }),
      );
      return { apps };
    }
    const conditions = {
      parent,
    };
    let query = AppModel.find(conditions);
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
    const countQuery = AppModel.countDocuments(conditions);
    const [apps, count] = await Promise.all([query, countQuery]);
    return { apps, count };
  }

  static async index(req, res) {
    const { apps, count } = await AppController.getApps(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      apps,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let query = AppModel.findById(id);
    if (populate === '1') {
      query = query.populate('parent');
    }
    const app = await query;
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      app,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const app = await AppModel.findById(id);
    if (app.childrenCount > 0) {
      throw new AppError(500, messages.hasChildrenError, null, true);
    }
    const promiseQueue = [
      app.delete(),
    ];
    if (app.parent) {
      promiseQueue.push(
        AppModel.findByIdAndUpdate(app.parent, {
          $inc: {
            childrenCount: -1,
          },
        }),
      );
    }
    const deletedApp = new DeletedAppModel(app.toObject());
    promiseQueue.push(deletedApp.save());
    await Promise.all(promiseQueue);
    return res.send({ statusCode: 200, message: messages.deleted, app });
  }

  static async update(req, res) {
    const validationResult = Joi.validate(req.body, schemas.appSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      arName,
      enName,
      route,
      apiRoute,
      scopeRequired,
    } = req.body;
    const escapedArName = htmlEscape(arName);
    const escapedEnName = htmlEscape(enName);
    const escapedRoute = htmlEscape(route);
    const escapedApiRoute = htmlEscape(apiRoute);
    const newApp = {
      arName: escapedArName,
      enName: escapedEnName,
      route: escapedRoute,
      apiRoute: escapedApiRoute,
      signature: req.signature,
      scopeRequired,
    };
    const app = await AppModel.findByIdAndUpdate(id, {
      $set: {
        ...newApp,
      },
    });
    const logApp = new LogAppModel({
      _id: new mongoose.Types.ObjectId(),
      app: app.toObject(),
      message: `Updating App to ${JSON.stringify(newApp)}`,
      signature: req.signature,
    });
    await logApp.save();
    return res.send({
      statusCode: 200,
      message: messages.updated,
      app: {
        ...app.toObject(),
        ...newApp,
      },
    });
  }
}

module.exports = AppController;
