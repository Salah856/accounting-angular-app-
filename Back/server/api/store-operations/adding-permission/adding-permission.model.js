const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const addedItemSchema = Schema({
  _id: Schema.Types.ObjectId,
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
});

const schema = Schema({
  _id: Schema.Types.ObjectId,
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  notes: {
    type: Schema.Types.String,
  },
  storeSecretary: {
    type: Schema.Types.String,
    required: true,
  },
  addedItems: {
    type: [addedItemSchema],
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  addingPermission: {
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
const AddingPermission = mongoose.model('AddingPermission', schema);
const DeletedAddingPermission = mongoose.model('DeletedAddingPermission', schema);
const LogAddingPermission = mongoose.model('LogAddingPermission', logSchema);

module.exports = { AddingPermission, DeletedAddingPermission, LogAddingPermission };
