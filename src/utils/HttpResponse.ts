import { HttpResponse } from 'src/types';

export const makeHttpResponse = ({
  statusCode,
  data,
}: {
  statusCode: number;
  data?: Record<string, any>;
}): HttpResponse => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    statusCode,
    data: data,
  },
});
