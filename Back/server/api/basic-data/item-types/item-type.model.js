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
  itemType: {
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
const ItemType = mongoose.model('ItemType', schema);
const DeletedItemType = mongoose.model('DeletedItemType', schema);
const LogItemType = mongoose.model('LogItemType', logSchema);

module.exports = { ItemType, DeletedItemType, LogItemType };
