import Joi from 'joi';
import { AdaptedRequest, BLFunction } from '../types';
import { makeHttpError } from '../utils/HttpError';

const attemptSchema = (schema: Joi.ObjectSchema) => (value: object) => {
  return Joi.attempt(value, schema);
};

export const withReqValidator = ({
  fn,
  schema,
}: {
  fn: BLFunction;
  schema: Joi.ObjectSchema;
}) => (requestData: AdaptedRequest<any>) => {
  try {
    attemptSchema(schema)(requestData);
    return fn(requestData);
  } catch (e) {
    return makeHttpError({
      statusCode: 400,
      error: 'Wrong Request',
    });
  }
};
