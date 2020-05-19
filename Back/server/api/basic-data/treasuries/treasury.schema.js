const Joi = require('joi');

const treasurySchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  active: Joi.boolean().required(),
  createdAt: Joi.date().required().iso(),
  openingBalance: Joi.number().required().min(0),
  currentBalance: Joi.number().required().min(0),
  currency: Joi.string().required().min(1).max(100),
});

module.exports = {
  treasurySchema,
};
