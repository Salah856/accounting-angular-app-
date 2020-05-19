const mongoose = require('mongoose');

const { Schema } = mongoose;
const rightSchema = Schema({
  _id: Schema.Types.ObjectId,
  app: {
    type: Schema.Types.ObjectId,
    ref: 'App',
    required: true,
  },
  scope: {
    type: Schema.Types.ObjectId,
    ref: 'Foundation',
  },
  rights: [{
    type: Schema.Types.ObjectId,
    ref: 'Right',
    required: true,
  }],
});

const schema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  email: {
    type: Schema.Types.String,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
  },
  phoneNumbers: [{ type: Schema.Types.String }],
  imageUrl: {
    type: Schema.Types.String,
  },
  userRights: [
    rightSchema,
  ],
  signature: {
    type: Schema.Types.String,
    required: true,
  },
});
const logSchema = Schema({
  _id: Schema.Types.ObjectId,
  user: {
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

const User = mongoose.model('User', schema);
User.createIndexes();
const DeletedUser = mongoose.model('DeletedUser', schema);
const LogUser = mongoose.model('LogUser', logSchema);
module.exports = { User, DeletedUser, LogUser };
