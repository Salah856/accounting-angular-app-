const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  barcode: {
    type: Schema.Types.String,
    required: true,
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'ItemUnit',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ItemCategory',
    required: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ItemType',
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: 'Currency',
    required: true,
  },
  purchasePrice: {
    type: Schema.Types.Number,
    required: true,

  },
  sellingPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  wholesalePrice: {
    type: Schema.Types.Number,
    required: true,
  },
  defectivePrice: {
    type: Schema.Types.Number,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  item: {
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
const Item = mongoose.model('Item', schema);
const DeletedItem = mongoose.model('DeletedItem', schema);
const LogItem = mongoose.model('LogItem', logSchema);

module.exports = { Item, DeletedItem, LogItem };
