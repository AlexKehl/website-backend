import { HttpError, MakeHttpErrorData } from '../types';

export const makeHttpError = ({
  statusCode,
  data = {},
}: MakeHttpErrorData): HttpError => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  success: false,
  data,
  isHttpError: true,
});
