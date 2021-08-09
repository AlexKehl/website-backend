import { Express } from 'express';
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

export const startGalleryRoutes = (app: Express) => {
  app.post(
    '/file/gallery/upload',
    routeHandler({
      controller: galleryUploadController,
      guards: [hasRoleGuard('Admin'), hasValidAccessToken],
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
