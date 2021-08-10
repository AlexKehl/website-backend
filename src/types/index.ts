import { Request, Response } from 'express';
import { WithBody } from './RequestObject';

export type ExpressResponse = Response;
export type ExpressRequest = Request;
export type ExpressObj<T = any> = { req: WithBody<T>; res: ExpressResponse };

export type Controller<T = any> = (expressObj: ExpressObj<T>) => Promise<void>;
export type RouteGuard<T = any> = (
  expressObj: ExpressObj<T>
) => Promise<ExpressObj>;

export interface RouteHandlerObj<T = any> {
  controller: Controller<T>;
  guards?: RouteGuard<T>[];
}

export type RouteHandler = (
  routeHandlerObj: RouteHandlerObj
) => (req: ExpressRequest, res: ExpressResponse) => Promise<void>;

export type ToExpressObj = (
  req: ExpressRequest,
  res: ExpressResponse
) => ExpressObj;

export interface HttpError {
  headers: Record<string, string>;
  statusCode: number;
  isHttpError: true;
  data?: {
    success: boolean;
    error?: string;
    [x: string]: any;
  };
}

export interface ServerStartOptions {
  port: number;
  startupMessage?: string;
}

export * from './RequestObject';
export * from './Responses';
