import { RouteHandler } from '../types';
import { HttpErrorRouteHandler } from './HttpErrorHandler';
import { toExpressObj } from './RequestAdapter';

const routeHandler: RouteHandler =
  ({ controller }) =>
  async (req, res) => {
    try {
      const expressObj = toExpressObj(req, res);
      return await controller(expressObj);
    } catch (e: any) {
      HttpErrorRouteHandler(res)(e);
    }
  };

export default routeHandler;
