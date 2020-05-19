const Joi = require('joi');

const rightSchema = Joi.object().keys({
  app: Joi.string().required().min(1).max(100),
  scope: Joi.string().allow(null).min(1).max(100),
  rights: Joi.array().required().items(Joi.string().required().min(1).max(100)),
});

const userRightsSchema = Joi.object().keys({
  userRights: Joi.array().items(rightSchema.required()).required(),
});

const userSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  username: Joi.string().required().min(1).max(100),
  password: Joi.string().required().min(1).max(100),
  email: Joi.string().allow(null).email(),
  active: Joi.boolean().required(),
  imageUrl: Joi.string(),
  image: Joi.any(),
  phoneNumbers: Joi.array().items(Joi.string()),
});

module.exports = {
  userSchema,
  userRightsSchema,
};
