import { Request, Response } from 'express';
import { WithBody } from './RequestObject';
import { HttpResponse } from './Responses';

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

export interface UserResponse {
  email: string;
}

export interface EmailWithTokens {
  email: string;
  refreshToken: string;
  refreshTokenHash: string;
}

export interface DecodedRefreshToken {
  email: string;
  iat: number;
}

export interface DecodedAccessToken {
  email: string;
  iat: number;
}

export * from './RequestObject';
export * from './Dto';
export * from './Gallery';
export * from './Responses';
export * from './ClientInterface';
export * from './Texts';
