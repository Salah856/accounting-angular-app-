const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  imageUrl: {
    type: Schema.Types.String,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  company: {
    type: schema,
    required: true,
  },
  message: {
    type: Schema.Types.String,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const Company = mongoose.model('Company', schema);
const DeletedCompany = mongoose.model('DeletedCompany', schema);
const LogCompany = mongoose.model('LogCompany', logSchema);
module.exports = { Company, DeletedCompany, LogCompany };
