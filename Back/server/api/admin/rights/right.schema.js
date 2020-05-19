const Joi = require('joi');

const rightSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  rightId: Joi.number().required(),
});

module.exports = {
  rightSchema,
};
