import { Schema } from 'express-validator';

const fileWithMetaSchema: Schema = {
  category: {
    errorMessage: 'Missing category',
    isString: true,
  },
  'images.*.description': {
    isString: true,
  },
  'images.*.isForSell': {
    isBoolean: true,
  },
  'images.*.price': {
    isNumeric: true,
    optional: { options: { nullable: true } },
  },
  'images.*.image': {
    isString: true,
  },
  'images.*.name': {
    isString: true,
  },
  'images.*.size.width': {
    isNumeric: true,
  },
  'images.*.size.height': {
    isNumeric: true,
  },
};

export default fileWithMetaSchema;
