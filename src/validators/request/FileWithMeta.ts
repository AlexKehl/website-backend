import { Schema } from 'express-validator';

const fileWithMetaSchema: Schema = {
  id: {
    isString: true,
    optional: { options: { nullable: true } },
  },
  category: {
    errorMessage: 'Missing category',
    isString: true,
  },
  description: {
    isString: true,
    optional: { options: { nullable: true } },
  },
  isForSell: {
    isBoolean: true,
  },
  price: {
    custom: {
      options: (value, { req }) => {
        if (!req.body.isForSell) {
          return true;
        }
        return Boolean(req.body.price);
      },
    },
    errorMessage: 'Price must be provided if item is for sell.',
  },
  image: {
    isString: true,
  },
  name: {
    isString: true,
  },
  'size.width': {
    isNumeric: true,
  },
  'size.height': {
    isNumeric: true,
  },
};

export default fileWithMetaSchema;
