import { Schema } from 'express-validator';
import { get } from 'lodash';

const fileWithMetaSchema: Schema = {
  category: {
    errorMessage: 'Missing category',
    isString: true,
  },
  'images.*.description': {
    isString: true,
    optional: { options: { nullable: true } },
  },
  'images.*.isForSell': {
    isBoolean: true,
  },
  'images.*.price': {
    custom: {
      options: (value, { req, path }) => {
        const splitted = path.split('.');
        splitted.pop();
        const modifiedPath = splitted.join('.');
        const currentImage = get(req.body, modifiedPath);
        if (!currentImage.isForSell) {
          return true;
        }
        return Boolean(currentImage.price);
      },
    },
    errorMessage: 'Price must be provided if item is for sell.',
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
