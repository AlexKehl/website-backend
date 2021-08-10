import { CookieOptions, Request } from 'express';

export interface Cookie {
  name: string;
  val: string;
  options?: CookieOptions;
}

export interface MakeHttpResponseData {
  statusCode: number;
  cookies?: Cookie[];
  headers?: Record<string, any>;
  data?: Record<string, any>;
}

export interface MakeHttpErrorData {
  statusCode: number;
  data: {
    error: string;
    [x: string]: any;
  };
}

export interface WithBody<T> extends Request {
  body: T;
}
