import { CookieOptions, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Category } from '.';

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

export interface AdaptedRequest<T extends Request> {
  readonly headers: T['headers'];
  readonly path: T['path'];
  readonly method: T['method'];
  readonly pathParams: ParamsDictionary;
  readonly queryParams: Record<string, any>;
  readonly body: T['body'];
}

export interface WithBody<T> extends Request {
  body: T;
}

export interface FileMeta {
  category: Category;
  name: string;
  height: number;
  width: number;
  description?: string;
}
