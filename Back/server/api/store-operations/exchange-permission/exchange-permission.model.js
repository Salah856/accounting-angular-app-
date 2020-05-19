const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const exchangedItemSchema = Schema({
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
  exchangedItems: {
    type: [exchangedItemSchema],
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  exchangePermission: {
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
const ExchangePermission = mongoose.model('ExchangePermission', schema);
const DeletedExchangePermission = mongoose.model('DeletedExchangePermission', schema);
const LogExchangePermission = mongoose.model('LogExchangePermission', logSchema);

module.exports = { ExchangePermission, DeletedExchangePermission, LogExchangePermission };
