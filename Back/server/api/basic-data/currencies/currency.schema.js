const Joi = require('joi');

const currencySchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  symbol: Joi.string().required().min(1).max(100),
});

module.exports = {
  currencySchema,
};
