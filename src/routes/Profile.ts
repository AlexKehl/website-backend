import { Express } from 'express';
import { orderImageUploadController } from '../controllers/Profile';
import { hasFilesAttached } from '../guards/HasFileAttached';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import { hasValidatedData } from '../guards/HasValidatedData';
import upload from '../utils/MulterConfig';
import routeHandler from '../utils/RouteHandler';

export const startProfileRoutes = (app: Express) => {
  app.post(
    '/file/sync/orderimages',
    upload.array('files'),
    routeHandler({
      controller: orderImageUploadController,
      guards: [hasValidatedData, hasValidAccessToken, hasFilesAttached],
    })
  );
};
