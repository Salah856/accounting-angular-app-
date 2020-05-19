const Joi = require('joi');
const htmlEscape = require('html-escape');
const mongoose = require('mongoose');
const Path = require('path');
const CompanyModel = require('./company.model').Company;
const DeletedCompanyModel = require('./company.model').DeletedCompany;
const LogCompanyModel = require('./company.model').LogCompany;
const FileHandler = require('../../../utils/file-handler');
const schemas = require('./company.schema');
const AppError = require('../../../utils/app-error');

const messages = {
  wrongSchema: 'خطأ فى البيانات المدخلة|Wrong User Input',
  created: 'تم حفظ الشركة بنجاح|Company created successfully',
  updated: 'تم تعديل الشركة بنجاح|Company updated successfully',
  deleted: 'تم حذف الشركة بنجاح|Company deleted successfully',
  foundAll: 'تم العثور على الشركات بنجاح|Companies found successfully',
  foundOne: 'تم العثور على الشركة بنجاح|Company found successfully',
};

class CompanyController {
  static async getCompanies(options = {}) {
    const {
      limit,
      skip,
      sortField,
      sortDirection,
    } = options;
    let query = CompanyModel.find();
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
    const countQuery = CompanyModel.estimatedDocumentCount();
    const [companies, count] = await Promise.all([query, countQuery]);
    return { companies, count };
  }

  static async create(req, res) {
    const requestBody = {};
    Object.keys(req.body).forEach((key) => {
      requestBody[key] = JSON.parse(req.body[key]);
    });
    const validationResult = Joi.validate(requestBody, schemas.companySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { name } = requestBody;
    const companyId = new mongoose.Types.ObjectId();
    let company = {
      _id: companyId,
      name: htmlEscape(name),
      signature: req.signature,
    };
    const image = req.files[0];
    if (image) {
      const imagePath = Path.join(global.publicDirectory, 'uploads', 'companies',
        `${companyId}.${image.originalname.split('.')[1]}`);
      const imageUrl = `/uploads/companies/${companyId}.${image.originalname.split('.')[1]}`;
      const tempPath = Path.join(global.baseDirectory, image.path);
      company = { ...company, imageUrl };
      const imageData = await FileHandler.readFile(tempPath);
      await FileHandler.writeFile(imagePath, imageData);
      await FileHandler.deleteFile(tempPath);
    }
    const createdCompany = new CompanyModel(company);
    await createdCompany.save();
    return res.send({ statusCode: 200, message: messages.created, company });
  }

  static async index(req, res) {
    const { companies, count } = await CompanyController.getCompanies(req.query);
    return res.send({
      statusCode: 200,
      message: messages.foundAll,
      rights: req.appRights,
      companies,
      count,
    });
  }

  static async show(req, res) {
    const { id } = req.params;
    const company = await CompanyModel.findById(id);
    return res.send({
      statusCode: 200,
      message: messages.foundOne,
      rights: req.appRights,
      company,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const company = await CompanyModel.findOneAndDelete({ _id: id });
    const deletedCompany = new DeletedCompanyModel(company.toObject());
    await deletedCompany.save();
    return res.send({ statusCode: 200, message: messages.deleted, company });
  }

  static async update(req, res) {
    const requestBody = {};
    Object.keys(req.body).forEach((key) => {
      requestBody[key] = JSON.parse(req.body[key]);
    });
    const validationResult = Joi.validate(requestBody, schemas.companySchema);
    if (validationResult.error) {
      throw new AppError(500, messages.wrongSchema, validationResult, true);
    }
    const { id } = req.params;
    const { name } = requestBody;
    let newCompany = {
      name: htmlEscape(name),
      signature: req.signature,
    };
    const image = req.files[0];
    if (image) {
      const imagePath = Path.join(global.publicDirectory, 'uploads', 'companies',
        `${id}.${image.originalname.split('.')[1]}`);
      const imageUrl = `/uploads/companies/${id}.${image.originalname.split('.')[1]}`;
      const tempPath = Path.join(global.baseDirectory, image.path);
      newCompany = { ...newCompany, imageUrl };
      const imageData = await FileHandler.readFile(tempPath);
      await FileHandler.writeFile(imagePath, imageData);
      await FileHandler.deleteFile(tempPath);
    }
    const company = await CompanyModel
      .findByIdAndUpdate(id, { $set: { ...newCompany } });
    const logCompany = new LogCompanyModel({
      _id: new mongoose.Types.ObjectId(),
      company: company.toObject(),
      message: `Updating Company to ${JSON.stringify(newCompany)}`,
      signature: req.signature,
    });
    await logCompany.save();
    return res.send({ statusCode: 200, message: messages.updated, company: newCompany });
  }
}

module.exports = CompanyController;
