const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  constant: {
    type: Schema.Types.Boolean,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  receiptClause: {
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
const ReceiptClause = mongoose.model('ReceiptClause', schema);
const DeletedReceiptClause = mongoose.model('DeletedReceiptClause', schema);
const LogReceiptClause = mongoose.model('LogReceiptClause', logSchema);

module.exports = { ReceiptClause, DeletedReceiptClause, LogReceiptClause };
