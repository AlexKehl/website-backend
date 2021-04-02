// import { Document } from 'mongoose';

export type BLFunction = (x: any) => Promise<HttpResponse | HttpError>;

export interface HttpError {
  headers: Record<string, string>;
  statusCode: number;
  data: {
    success: boolean;
    error: string;
  };
}

export interface HttpResponse {
  headers: Record<string, string>;
  statusCode: number;
  data: {
    statusCode: number;
    data: Record<string, any>;
  };
}

export * from './RequestObject';
export * from './Model';
