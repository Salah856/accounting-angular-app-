const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  arName: {
    type: Schema.Types.String,
    required: true,
  },
  enName: {
    type: Schema.Types.String,
    required: true,
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Foundation',
  },
  parentTotalId: {
    type: Schema.Types.String,
  },
  childrenCount: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  foundation: {
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

const Foundation = mongoose.model('Foundation', schema);
const DeletedFoundation = mongoose.model('DeletedFoundation', schema);
const LogFoundation = mongoose.model('LogFoundation', logSchema);
module.exports = { Foundation, DeletedFoundation, LogFoundation };
