const Joi = require('joi');

const itemUnitSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  numberOfItems: Joi.number().min(1).max(99999),
});

module.exports = {
  itemUnitSchema,
};
