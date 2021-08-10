import { Express } from 'express';
import { checkSchema } from 'express-validator';
import {
  galleryDeleteController,
  galleryUploadController,
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
    '/file/gallery/upload',
    checkSchema(FileWithMeta),
    routeHandler({
      controller: galleryUploadController,
      guards: [hasRoleGuard('Admin'), hasValidAccessToken, hasValidatedData],
    })
  );

  app.post(
    '/file/gallery/delete',
    routeHandler({
      controller: galleryDeleteController,
      guards: [hasRoleGuard('Admin'), hasValidAccessToken],
    })
  );

  app.post(
    '/file/gallery/update'
    //TODO
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
