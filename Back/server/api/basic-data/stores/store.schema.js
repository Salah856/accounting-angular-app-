const Joi = require('joi');

const storeSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  active: Joi.boolean().required(),
  createdAt: Joi.date().required().iso(),
  phoneNumbers: Joi.array().items(Joi.string()),
  email: Joi.string().allow(null).email(),
  fax: Joi.string().allow(null),
  address: Joi.string().allow(null),
  website: Joi.string().allow(null),
});

module.exports = {
  storeSchema,
};
