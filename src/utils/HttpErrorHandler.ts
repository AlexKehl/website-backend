import { ExpressResponse } from '../types';
import WithPayloadError from './Exceptions/WithPayloadError';
import { makeHttpError } from './HttpError';
import HttpStatus from './HttpStatus';

export const HttpErrorHandler = (res: ExpressResponse) => (err: any) => {
  if (err instanceof WithPayloadError) {
    const { data, statusCode, headers } = err.getPayload();
    return res.set(headers).status(statusCode).send(data);
  }

  throw err;
};
