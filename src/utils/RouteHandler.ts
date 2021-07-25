import { RouteHandler } from '../types';
import { HttpErrorHandler } from './HttpErrorHandler';
import { toExpressObj } from './RequestAdapter';

const routeHandler: RouteHandler = ({ controller, guards }) => async (
  req,
  res
) => {
  try {
    const expressObj = toExpressObj(req, res);
    if (!guards || guards?.length === 0) {
      return controller(expressObj);
    }
    for (const guard of guards) {
      console.log(guard);
      await guard(expressObj);
    }
    return controller(expressObj);
  } catch (e) {
    HttpErrorHandler(res)(e);
  }
};

export default routeHandler;
