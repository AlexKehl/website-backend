import { ExpressObj } from '../types';
import { validationResult } from 'express-validator';
import HttpStatus from '../../common/constants/HttpStatus';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

const hasValidatedData = async (expressObj: ExpressObj) => {
  const errors = validationResult(expressObj.req);
  if (!errors.isEmpty()) {
    throw new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: 'Has wrong fields',
        errors: errors.array(),
      },
    });
  }
  return expressObj;
};

export { hasValidatedData };
