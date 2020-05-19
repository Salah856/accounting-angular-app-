const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  symbol: {
    type: Schema.Types.String,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});

const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  currency: {
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
const Currency = mongoose.model('Currency', schema);
const DeletedCurrency = mongoose.model('DeletedCurrency', schema);
const LogCurrency = mongoose.model('LogCurrency', logSchema);
module.exports = { Currency, DeletedCurrency, LogCurrency };
