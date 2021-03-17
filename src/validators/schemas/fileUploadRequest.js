const Joi = require('joi');
const Categories = require('src/configuration/Categories');

const fileUploadRequest = Joi.object({
  image: Joi.object({
    mv: Joi.function(),
  }),
  fileMeta: Joi.object({
    name: Joi.string().required(),
    category: Joi.string()
      .valid(...Categories)
      .required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
    description: Joi.string(),
  }),
});

module.exports = fileUploadRequest;
