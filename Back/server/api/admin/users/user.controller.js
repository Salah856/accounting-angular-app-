const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Path = require('path');
const UserModel = require('./user.model').User;
const DeletedUserModel = require('./user.model').DeletedUser;
const LogUserModel = require('./user.model').LogUser;

const schemas = require('./user.schema');
const AppError = require('../../../utils/app-error');
const basicAttributes = require('../../../utils/basic-attributes');
const { rightEventBus } = require('../rights');
const { foundationEventBus } = require('../foundations');
const { appEventBus } = require('../apps');

const FileHandler = require('../../../utils/file-handler');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ المستخدم بنجاح|User created successfully',
  updated: 'تم تعديل المستخدم بنجاح|User updated successfully',
  updatedRights: 'تم تعديل صلاحيات المستخدم بنجاح|User Rights updated successfully',
  deleted: 'تم حذف المستخدم بنجاح|User deleted successfully',
  deletedRights: 'تم حذف صلاحيات المستخدم بنجاح|User Rights deleted successfully',
  foundAll: 'تم العثور على المستخدمين بنجاح|Users found successfully',
  foundOne: 'تم العثور على المستخدم بنجاح|User found successfully',
  foundOneRights: 'تم العثور على صلاحيات المستخدم بنجاح|User Rights found successfully',
  foundOneApps: 'تم العثور على تطبيقات المستخدم بنجاح|User Apps found successfully',
  authFailed: 'اسم مستخدم أو كلمة مرور خاطئة|Wrong Username Or Password',
  loggedIn: 'تم تسجيل الدخول بنجاح|Logged In Successfully',
  duplicateUsername: 'اسم المستخدم موجود من قبل|Username Already Taken',
  foundOptions: 'تم العثور على الاختيارات بنجاح|Options found successfully',

};

class UserController {
  static async rightOptions(req, res) {
    const queries = [
      appEventBus.emit('getApps'),
      rightEventBus.emit('getRights'),
      foundationEventBus.emit('getFoundations'),
    ];
    const [
      apps,
      rights,
      foundations,
    ] = await Promise.all(queries);
    const options = {
      ...apps,
      ...rights,
      ...foundations,
    };
    delete options.count;
    return res.send({ statusCode: 200, message: messages.foundOptions, options });
  }

  static async getRights(id, options) {
    const { populate } = options;
    let query = UserModel.findById(id, {
      _id: 1,
      signature: 1,
      userRights: 1,
    });
    if (populate === '1') {
      query = query.populate(['userRights.app', 'userRights.scope', 'userRights.rights']);
    }
    const user = await query;
    return user;
  }

  static async create(req, res) {
    const requestBody = {};
    Object.keys(req.body).forEach((key) => {
      requestBody[key] = JSON.parse(req.body[key]);
    });
    const validationResult = Joi.validate(requestBody, schemas.userSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const {
      name,
      username,
      password,
      active,
      phoneNumbers,
      email,
    } = requestBody;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new AppError(500, messages.duplicateUsername, existingUser, true);
    }
    const userId = new mongoose.Types.ObjectId();
    let user = {
      _id: userId,
      name: htmlEscape(name),
      username: htmlEscape(username),
      password: await bcrypt.hash(htmlEscape(password), 10),
      phoneNumbers: phoneNumbers ? phoneNumbers.map(item => htmlEscape(item)) : [],
      email: htmlEscape(email),
      signature: req.signature,
      active,
    };
    const image = req.files[0];
    if (image) {
      const imagePath = Path.join(global.publicDirectory, 'uploads', 'users',
        `${userId}.${image.originalname.split('.')[1]}`);
      const imageUrl = `/uploads/users/${userId}.${image.originalname.split('.')[1]}`;
      const tempPath = Path.join(global.baseDirectory, image.path);
      user = { ...user, imageUrl };
      const imageData = await FileHandler.readFile(tempPath);
      await FileHandler.writeFile(imagePath, imageData);
      await FileHandler.deleteFile(tempPath);
    }
    const createdUser = new UserModel(user);
    await createdUser.save();
    return res.send({ statusCode: 200, message: messages.created, user });
  }

  static async index(req, res) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = req.query;
    let query = UserModel.find({}, {
      userRights: 0,
      password: 0,
    });
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
    const countQuery = UserModel.estimatedDocumentCount();
    const [users, count] = await Promise.all([query, countQuery]);
    const mappedUsers = users.map(
      item => ({
        ...item.toObject(),
        active: { value: item.active, label: basicAttributes[item.active.toString()] },
      }),
    );
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      users: mappedUsers,
      rights: req.appRights,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const { populate } = req.query;
    let user = await UserModel.findById(id, {
      userRights: 0,
      password: 0,
    });
    if (populate === '1') {
      user = {
        ...user.toObject(),
        active: { value: user.active, label: basicAttributes[user.active.toString()] },
      };
    }
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      user,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const user = await UserModel.findOneAndDelete({ _id: id });
    const deletedUser = new DeletedUserModel(user.toObject());
    await deletedUser.save();
    return res.send({ statusCode: 200, message: messages.deleted, user });
  }

  static async update(req, res) {
    const requestBody = {};
    Object.keys(req.body).forEach((key) => {
      requestBody[key] = JSON.parse(req.body[key]);
    });
    const validationResult = Joi.validate(requestBody, schemas.userSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      name,
      username,
      password,
      active,
      phoneNumbers,
      email,
    } = requestBody;
    const existingUser = await UserModel.findOne({
      username,
      _id: { $ne: id },
    });
    if (existingUser) {
      throw new AppError(500, messages.duplicateUsername, existingUser, true);
    }
    let newUser = {
      name: htmlEscape(name),
      username: htmlEscape(username),
      password: await bcrypt.hash(htmlEscape(password), 10),
      phoneNumbers: phoneNumbers ? phoneNumbers.map(item => htmlEscape(item)) : [],
      email: htmlEscape(email),
      signature: req.signature,
      active,
    };
    const image = req.files[0];
    if (image) {
      const imagePath = Path.join(global.publicDirectory, 'uploads', 'users',
        `${id}.${image.originalname.split('.')[1]}`);
      const imageUrl = `/uploads/users/${id}.${image.originalname.split('.')[1]}`;
      const tempPath = Path.join(global.baseDirectory, image.path);
      newUser = { ...newUser, imageUrl };
      const imageData = await FileHandler.readFile(tempPath);
      await FileHandler.writeFile(imagePath, imageData);
      await FileHandler.deleteFile(tempPath);
    }
    const user = await UserModel.findByIdAndUpdate(id,
      {
        $set: {
          ...newUser,
        },
      });
    const logUser = new LogUserModel({
      _id: new mongoose.Types.ObjectId(),
      user: user.toObject(),
      message: `Updating User to ${JSON.stringify(newUser)}`,
      signature: req.signature,
    });
    await logUser.save();
    return res.send({ statusCode: 200, message: messages.updated, user: newUser });
  }

  static async showRights(req, res) {
    const { id } = req.params;
    const user = await UserController.getRights(id, req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundOneRights,
      rights: req.appRights,
      user,
    });
  }

  static async showApps(req, res) {
    const { id } = req.user;
    const user = await UserController.getRights(id, req.query);
    const userAppsObj = {};
    if (user.userRights) {
      user.userRights.forEach((userRight) => { userAppsObj[userRight.app] = true; });
    }
    const { apps } = await appEventBus.emit('getApps', { all: '1' });
    const userApps = [];

    apps.forEach((app) => {
      if (app.childrenCount > 0) {
        // eslint-disable-next-line no-underscore-dangle
        const userAppChildren = app.children.filter(child => userAppsObj[child._id]);
        if (userAppChildren.length > 0) {
          userApps.push({
            ...app,
            children: userAppChildren,
          });
        }
        // eslint-disable-next-line no-underscore-dangle
      } else if (userAppsObj[app._id]) {
        userApps.push(app);
      }
    });
    return res.send({
      statusCode: 200,
      message: messages.foundOneApps,
      userApps,
    });
  }

  static async deleteRights(req, res) {
    const { id } = req.params;
    const newUser = {
      userRights: null,
    };
    const user = await UserModel.findByIdAndUpdate(id,
      {
        $set: {
          ...newUser,
        },
      });
    const logUser = new LogUserModel({
      _id: new mongoose.Types.ObjectId(),
      user: user.toObject(),
      message: `Updating User to ${JSON.stringify(newUser)}`,
      signature: req.signature,
    });
    await logUser.save();
    return res.send({ statusCode: 200, message: messages.deletedRights, user: newUser });
  }

  static async updateRights(req, res) {
    const validationResult = Joi.validate(req.body, schemas.userRightsSchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const {
      userRights,
    } = req.body;
    const escapedUserRights = userRights.map(userRight => ({
      app: htmlEscape(userRight.app),
      scope: htmlEscape(userRight.scope),
      rights: userRight.rights.map(right => htmlEscape(right)),
    }));
    const newUser = {
      userRights: escapedUserRights,
    };
    const user = await UserModel.findByIdAndUpdate(id,
      {
        $set: {
          ...newUser,
        },
      });
    const logUser = new LogUserModel({
      _id: new mongoose.Types.ObjectId(),
      user: user.toObject(),
      message: `Updating User to ${JSON.stringify(newUser)}`,
      signature: req.signature,
    });
    await logUser.save();
    return res.send({ statusCode: 200, message: messages.updatedRights, user: newUser });
  }

  static async login(req, res) {
    const { username, password } = req.body;
    const userCredentials = await UserModel.findOne({ username });
    if (!userCredentials) {
      throw new AppError(500, messages.authFailed, null, true);
    }
    const userAuth = await bcrypt.compare(password, userCredentials.password);
    if (!userAuth) {
      throw new AppError(500, messages.authFailed, null, true);
    }
    const payload = { username, id: userCredentials.id };
    const signingOptions = {
      expiresIn: parseInt(process.env.expiresIn, 10),
      issuer: process.env.issuer,
      subject: process.env.subject,
      algorithm: process.env.algorithm,
    };
    const token = jwt.sign(
      payload,
      process.env.privateKey, signingOptions,
    );
    res.send({
      statusCode: 200,
      message: messages.loggedIn,
      imageUrl: userCredentials.imageUrl,
      token,
      username,
    });
  }
}

module.exports = UserController;
