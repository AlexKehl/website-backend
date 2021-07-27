import { HttpResponse, MakeHttpResponseData } from '../types';

export const makeHttpResponse = ({
  statusCode,
  data = {},
}: MakeHttpResponseData): HttpResponse => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    success: true,
    ...data,
  },
});
