const Joi = require('joi');

const loginRequest = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});

module.exports = loginRequest;
