import {
  ExpressResponse,
  HttpError,
  HttpResponse,
  MakeHttpResponseData,
} from '../types';

export const makeHttpResponse = ({
  statusCode,
  headers = {
    'Content-Type': 'application/json',
  },
  cookies = [],
  data = {},
}: MakeHttpResponseData): HttpResponse => ({
  headers: headers,
  statusCode,
  cookies,
  data: {
    success: true,
    ...data,
  },
  isHttpError: false,
});

export const evaluateHttpObject = (
  res: ExpressResponse,
  obj: HttpResponse | HttpError
) => {
  if (!obj.isHttpError && obj.cookies) {
    obj.cookies.forEach((cookie) => {
      res.cookie(cookie.name, cookie.val, cookie.options as any);
    });
  }
  res.set(obj.headers).status(obj.statusCode).send(obj.data);
};
