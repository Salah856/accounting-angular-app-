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
  paymentClause: {
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
const PaymentClause = mongoose.model('PaymentClause', schema);
const DeletedPaymentClause = mongoose.model('DeletedPaymentClause', schema);
const LogPaymentClause = mongoose.model('LogPaymentClause', logSchema);
module.exports = { PaymentClause, DeletedPaymentClause, LogPaymentClause };
