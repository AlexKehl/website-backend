const Joi = require('joi');
const loginRequest = require('src/validators/schemas/loginRequest');
const tokenRequest = require('src/validators/schemas/tokenRequest');
const fileUploadRequest = require('src/validators/schemas/fileUploadRequest');

const attemptSchema = schema => value => {
  return Joi.attempt(value, schema);
};

const applyValidator = schema => (req, res, next) => {
  try {
    attemptSchema(schema)(req.body);
    next();
  } catch (e) {
    res.sendStatus(400);
  }
};

module.exports = {
  validateLoginReq: applyValidator(loginRequest),
  validateTokenReq: applyValidator(tokenRequest),
  fileUploadRequest: applyValidator(fileUploadRequest),
};
