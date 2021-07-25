import { Request, Response } from 'express';
import { AdaptedRequest, WithBody } from './RequestObject';

export type ExpressResponse = Response;
export type ExpressRequest = Request;
export type ExpressObj<T = any> = { req: WithBody<T>; res: ExpressResponse };

export type BLFunction = (x: any) => Promise<HttpResponse | HttpError>;

export type Controller = (expressObj: ExpressObj) => Promise<void>;
export type RouteGuard = (expressObj: ExpressObj) => Promise<ExpressObj>;

export interface RouteHandlerObj {
  controller: Controller;
  guards?: RouteGuard[];
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
  success: boolean;
  isHttpError: boolean;
  data?: Record<string, any>;
}

export interface HttpResponse {
  headers: Record<string, string>;
  statusCode: number;
  success: boolean;
  data: Record<string, any>;
}

export * from './RequestObject';
export * from './Model';
