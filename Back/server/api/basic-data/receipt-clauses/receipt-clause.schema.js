const Joi = require('joi');

const ReceiptClauseSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  constant: Joi.boolean().required(),
});

module.exports = {
  ReceiptClauseSchema,
};
