const mongoose = require('mongoose');
// const AppError = require('../../utils/app-error');

const { Schema } = mongoose;

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
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
  itemCategory: {
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
const ItemCategory = mongoose.model('ItemCategory', schema);
const DeletedItemCategory = mongoose.model('DeletedItemCategory', schema);
const LogItemCategory = mongoose.model('LogItemCategory', logSchema);
module.exports = { ItemCategory, DeletedItemCategory, LogItemCategory };
