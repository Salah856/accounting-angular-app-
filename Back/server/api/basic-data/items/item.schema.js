const Joi = require('joi');

const itemSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  barcode: Joi.string().required().min(1).max(100),
  unit: Joi.string().required().min(1).max(100),
  category: Joi.string().required().min(1).max(100),
  type: Joi.string().required().min(1).max(100),
  company: Joi.string().required().min(1).max(100),
  currency: Joi.string().required().min(1).max(100),
  active: Joi.boolean().required(),
  purchasePrice: Joi.number().required().min(0).max(9999999),
  sellingPrice: Joi.number().required().min(0).max(9999999),
  wholesalePrice: Joi.number().required().min(0).max(9999999),
  defectivePrice: Joi.number().required().min(0).max(9999999),
});

module.exports = {
  itemSchema,
};
