import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ParamsDictionary } from 'express-serve-static-core';

export interface AdaptedRequest<T extends Request> {
  readonly headers: T['headers'];
  readonly path: T['path'];
  readonly method: T['method'];
  readonly pathParams: ParamsDictionary;
  readonly queryParams: Record<string, any>;
  readonly body: T['body'];
  readonly file: any;
}

export interface Credentials {
  email: string;
  password?: string;
  refreshToken?: string;
}

export interface Login extends Request {
  body: Credentials;
}

export interface FileMeta {
  category: string;
  name: string;
  height: number;
  width: number;
  description?: string;
}

export interface FileObj {
  [x: string]: UploadedFile;
}

export interface FileUpload extends Request {
  body: {
    fileMeta: FileMeta;
  };
  file?: FileObj;
}
