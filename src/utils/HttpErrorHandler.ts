import { ExpressResponse } from '../types';
import WithPayloadError from './Exceptions/WithPayloadError';
import { makeHttpError } from './HttpError';
import HttpStatus from './HttpStatus';
import { logger } from './Logger';

export const HttpErrorHandler = (res: ExpressResponse) => (err: Error) => {
  if (err instanceof WithPayloadError) {
    const { data, statusCode, headers } = err.getPayload();
    return res.set(headers).status(statusCode).send(data);
  }

  logger.log({ level: 'error', message: err.message });
  const { data, statusCode, headers } = makeHttpError({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    data: {
      error: 'Internal server error',
    },
  });

  return res.set(headers).status(statusCode).send(data);
};
