import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';

const hasFilesAttached = async (expressObj: ExpressObj) => {
  if (!expressObj.req.files) {
    throw new WithPayloadError({
      data: { error: 'Files are missing' },
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  return expressObj;
};

export { hasFilesAttached };
