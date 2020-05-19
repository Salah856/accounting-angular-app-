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
  route: {
    type: Schema.Types.String,
    required: true,
  },
  apiRoute: {
    type: Schema.Types.String,
    required: true,
  },
  scopeRequired: {
    type: Schema.Types.Boolean,
    required: true,
  },
  signature: {
    type: Schema.Types.String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'App',
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
  app: {
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

const App = mongoose.model('App', schema);
const DeletedApp = mongoose.model('DeletedApp', schema);
const LogApp = mongoose.model('LogApp', logSchema);
module.exports = { App, DeletedApp, LogApp };
