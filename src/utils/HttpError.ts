import { HttpError } from 'src/types';

export const makeHttpError = ({ statusCode, error }): HttpError => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    success: false,
    error,
  },
});
