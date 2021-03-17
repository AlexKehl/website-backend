const Joi = require('joi');

const tokenRequest = Joi.object({
  email: Joi.string(),
  refreshToken: Joi.string(),
});

module.exports = tokenRequest;
