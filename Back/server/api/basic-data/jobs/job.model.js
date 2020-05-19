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
  job: {
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
const Job = mongoose.model('Job', schema);
const DeletedJob = mongoose.model('DeletedJob', schema);
const LogJob = mongoose.model('LogJob', logSchema);

module.exports = { Job, DeletedJob, LogJob };
