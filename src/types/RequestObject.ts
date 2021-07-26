import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface MakeHttpResponseData {
  statusCode: number;
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

export interface Credentials {
  email: string;
  password?: string;
  refreshToken?: string;
}

export interface Login extends Request {
  body: Credentials;
}

export interface WithBody<T> extends Request {
  body: T;
}

export interface FileMeta {
  category: string;
  name: string;
  height: number;
  width: number;
  description?: string;
}
