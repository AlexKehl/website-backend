import { Express } from 'express';
import { Endpoints } from '../../common/constants/Endpoints';
import { getContactInformationController } from '../controllers/Profile';
import { hasValidAccessTokenGuard } from '../middleware/guards';
import routeHandler from '../utils/RouteHandler';

export const startProfileRoutes = (app: Express) => {
  app.get(
    Endpoints.user,
    hasValidAccessTokenGuard,
    routeHandler({
      controller: getContactInformationController,
    })
  );
};
