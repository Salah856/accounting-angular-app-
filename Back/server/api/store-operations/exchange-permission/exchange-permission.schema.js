const Joi = require('joi');

const exchangedItemSchema = Joi.object().keys({
  item: Joi.string().required().min(1).max(100),
  quantity: Joi.number().integer().required().min(0)
    .max(9999999),
});

const exchangePermissionSchema = Joi.object().keys({
  date: Joi.date().required().iso(),
  store: Joi.string().required().min(1).max(100),
  exchangedItems: Joi.array().required().items(exchangedItemSchema.required()),
  notes: Joi.string().min(1).max(1000),
  storeSecretary: Joi.string().required().min(1).max(100),
});

module.exports = {
  exchangePermissionSchema,
};
