import { Express } from 'express';
import { orderImageSyncController } from '../controllers/Profile';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import { hasValidatedData } from '../guards/HasValidatedData';
import routeHandler from '../utils/RouteHandler';

export const startProfileRoutes = (app: Express) => {
  app.post(
    '/file/sync/orderimages',
    routeHandler({
      controller: orderImageSyncController,
      guards: [hasValidatedData, hasValidAccessToken],
    })
  );
};
