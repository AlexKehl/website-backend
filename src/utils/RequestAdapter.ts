import { Request} from 'express';
import {AdaptedRequest } from 'src/types';

export const adaptRequest = <T extends Request>(req: T): AdaptedRequest<T> => {
  return Object.freeze({
    headers: req.headers,
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
    file: req?.files?.image,
  });
};

