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
  openingBalance: {
    type: Schema.Types.Number,
    required: true,
  },
  currentBalance: {
    type: Schema.Types.Number,
    required: true,
  },
  currency: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Currency',
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  treasury: {
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
const Treasury = mongoose.model('Treasury', schema);
const DeletedTreasury = mongoose.model('DeletedTreasury', schema);
const LogTreasury = mongoose.model('LogTreasury', logSchema);

module.exports = { Treasury, DeletedTreasury, LogTreasury };
