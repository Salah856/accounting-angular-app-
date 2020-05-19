const Joi = require('joi');

const jobSchema = Joi.object().keys({
  name: Joi.string().required().min(1).max(100),
});

module.exports = {
  jobSchema,
};
