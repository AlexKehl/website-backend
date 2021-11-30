import { Express } from 'express';
import { Endpoints } from '../../common/constants/Endpoints';
import { getContactInformationController } from '../controllers/Profile';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import routeHandler from '../utils/RouteHandler';

export const startProfileRoutes = (app: Express) => {
  app.get(
    Endpoints.user,
    routeHandler({
      controller: getContactInformationController,
      guards: [hasValidAccessToken],
    })
  );
};
