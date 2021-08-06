import { Express } from 'express';
import { checkSchema } from 'express-validator';
import {
  gallerySyncController,
  getImageByCategoryController,
  getImagePathsForCategoryController,
} from '../controllers/Gallery';
import { hasRoleGuard } from '../guards/HasRole';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import { hasValidatedData } from '../guards/HasValidatedData';
import routeHandler from '../utils/RouteHandler';
import FileWithMeta from '../validators/request/FileWithMeta';

export const startGalleryRoutes = (app: Express) => {
  app.post(
    '/file/sync/gallery',
    checkSchema(FileWithMeta),
    routeHandler({
      controller: gallerySyncController,
      guards: [hasRoleGuard('Admin'), hasValidatedData, hasValidAccessToken],
    })
  );

  app.get(
    '/files/:category',
    routeHandler({
      controller: getImagePathsForCategoryController,
      guards: [hasValidatedData],
    })
  );

  app.get(
    '/files/:category/:name',
    routeHandler({ controller: getImageByCategoryController })
  );
};
