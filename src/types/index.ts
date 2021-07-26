import { Request, Response } from 'express';
import { WithBody } from './RequestObject';

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
  isHttpError: boolean;
  data?: {
    success: boolean;
    error?: string;
    [x: string]: any;
  };
}

export interface HttpResponse {
  headers: Record<string, string>;
  statusCode: number;
  data: {
    success: boolean;
    [x: string]: any;
  };
}

export interface ServerStartOptions {
  port: number;
  startupMessage?: string;
}

export * from './RequestObject';
export * from './Dto';
