const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    required: true,
  },
  phoneNumbers: [{ type: Schema.Types.String }],
  email: {
    type: Schema.Types.String,
  },
  fax: {
    type: Schema.Types.String,
  },
  address: {
    type: Schema.Types.String,
  },
  website: {
    type: Schema.Types.String,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  store: {
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
const Store = mongoose.model('Store', schema);
const DeletedStore = mongoose.model('DeletedStore', schema);
const LogStore = mongoose.model('LogStore', logSchema);
module.exports = { Store, DeletedStore, LogStore };
