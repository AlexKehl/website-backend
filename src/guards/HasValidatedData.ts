import { ExpressObj } from '../types';
import { validationResult } from 'express-validator';
import { makeHttpError } from '../utils/HttpError';
import HttpStatus from '../utils/HttpStatus';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

const hasValidatedData = async (expressObj: ExpressObj) => {
  const errors = validationResult(expressObj.req);
  if (!errors.isEmpty()) {
    throw new WithPayloadError({
      message: 'Has Errors',
      payload: makeHttpError({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          message: 'Has wrong fields',
          errors: errors.array(),
        },
      }),
    });
    // return res.status(400).json({ errors: errors.array() });
  }
  return expressObj;
};

export { hasValidatedData };
