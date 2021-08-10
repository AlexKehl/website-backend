import { RouteHandler } from '../types';
import { HttpErrorRouteHandler } from './HttpErrorHandler';
import { toExpressObj } from './RequestAdapter';

const routeHandler: RouteHandler =
  ({ controller, guards }) =>
  async (req, res) => {
    try {
      const expressObj = toExpressObj(req, res);
      if (!guards || guards?.length === 0) {
        return controller(expressObj);
      }
      for (const guard of guards) {
        await guard(expressObj);
      }
      return controller(expressObj);
    } catch (e) {
      HttpErrorRouteHandler(res)(e);
    }
  };

export default routeHandler;
