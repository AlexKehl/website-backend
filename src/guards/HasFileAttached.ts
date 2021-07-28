import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';

const hasFileAttached = async (expressObj: ExpressObj) => {
  if (!expressObj.req.file) {
    throw new WithPayloadError({
      data: { error: 'File is missing' },
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  return expressObj;
};

export { hasFileAttached };
