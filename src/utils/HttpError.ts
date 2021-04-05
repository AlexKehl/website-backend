import { HttpError } from '../types';

export const makeHttpError = ({
  statusCode,
  error,
}: {
  statusCode: number;
  error: string;
}): HttpError => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    success: false,
    error,
  },
});
