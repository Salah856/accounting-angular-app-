const Joi = require('joi');

const foundationSchema = Joi.object().keys({
  arName: Joi.string().required().min(1).max(100),
  enName: Joi.string().required().min(1).max(100),
  active: Joi.boolean().required(),
  parent: Joi.string().allow(null).min(1).max(100),
});

module.exports = {
  foundationSchema,
};
