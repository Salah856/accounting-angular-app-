const Joi = require('joi');

const companySchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
  imageUrl: Joi.string(),
  image: Joi.any(),
});

module.exports = {
  companySchema,
};
