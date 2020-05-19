const Joi = require('joi');

const PaymentClauseSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  constant: Joi.boolean().required(),
});

module.exports = {
  PaymentClauseSchema,
};
