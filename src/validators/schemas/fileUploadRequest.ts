import * as Joi from 'joi';
import Categories from 'src/configuration/Categories';

export default Joi.object({
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
