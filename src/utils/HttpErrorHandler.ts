import { ExpressResponse } from '../types';
import WithPayloadError from './Exceptions/WithPayloadError';
import { makeInternalHttpError } from './HttpErrors';
import { logger } from './Logger';

export const HttpErrorRouteHandler = (res: ExpressResponse) => (err: Error) => {
  if (err instanceof WithPayloadError) {
    const { data, statusCode, headers } = err.getPayload();
    return res.set(headers).status(statusCode).send(data);
  }

  logger.log({ level: 'error', message: err.message });

  const { data, statusCode, headers } = makeInternalHttpError();
  return res.set(headers).status(statusCode).send(data);
};

export const handleHttpErrors = (err: Error) => {
  logger.log({ message: JSON.stringify(err, null, 2), level: 'error' });
  if (err instanceof WithPayloadError) {
    return err.getPayload();
  }
  return makeInternalHttpError();
};
