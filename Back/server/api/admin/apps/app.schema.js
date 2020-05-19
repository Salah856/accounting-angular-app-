const Joi = require('joi');

const appSchema = Joi.object().keys({
  arName: Joi.string().required().min(1).max(100),
  enName: Joi.string().required().min(1).max(100),
  route: Joi.string().required().min(1).max(100),
  apiRoute: Joi.string().required().min(1).max(100),
  parent: Joi.string().allow(null).min(1).max(100),
});

module.exports = {
  appSchema,
};
