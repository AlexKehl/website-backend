import { RouteHandler } from '../types';
import { HttpErrorRouteHandler } from './HttpErrorHandler';
import { toExpressObj } from './RequestAdapter';

const routeHandler: RouteHandler =
  ({ controller, guards = [] }) =>
  async (req, res) => {
    try {
      const expressObj = toExpressObj(req, res);
      for (const guard of guards) {
        await guard(expressObj);
      }
      return await controller(expressObj);
    } catch (e: any) {
      HttpErrorRouteHandler(res)(e);
    }
  };

export default routeHandler;
