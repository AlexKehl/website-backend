import { HttpError, MakeHttpErrorData } from '../types';
import WithPayloadError from './Exceptions/WithPayloadError';
import { ExpressResponse } from '../types';
import HttpStatus from './HttpStatus';
import { logger } from './Logger';

export interface TryToExecuteInput {
  fnToTry: () => Promise<any>;
  httpErrorData: MakeHttpErrorData;
  passThrough?: any;
}

export const makeHttpError = ({
  statusCode,
  data,
}: MakeHttpErrorData): HttpError => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    success: false,
    ...data,
  },
  isHttpError: true,
});

export const tryToExecute = async <T>({
  fnToTry,
  httpErrorData,
  passThrough,
}: TryToExecuteInput): Promise<T> => {
  const res = await fnToTry();
  return res
    ? Promise.resolve(passThrough || res)
    : Promise.reject(new WithPayloadError(httpErrorData));
};

export const makeInternalHttpError = () =>
  makeHttpError({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    data: {
      error: 'Internal server error',
    },
  });

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
  if (err instanceof WithPayloadError) {
    return err.getPayload();
  }
  logger.log({ message: err.message, level: 'error' });
  return makeInternalHttpError();
};
