import { AdaptedRequest, ToExpressObj, ExpressRequest } from '../types';

export const toExpressObj: ToExpressObj = (req, res) => ({ req, res });

export const adaptRequest = <T extends ExpressRequest>(
  req: T
): AdaptedRequest<T> => {
  return Object.freeze({
    headers: req.headers,
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
  });
};
