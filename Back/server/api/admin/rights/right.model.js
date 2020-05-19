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
  rightId: {
    type: Schema.Types.Number,
    required: true,
  },
});

const Right = mongoose.model('Right', schema);

module.exports = Right;
