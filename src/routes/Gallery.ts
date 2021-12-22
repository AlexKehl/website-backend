import express, { Express } from 'express';
import { checkSchema } from 'express-validator';
import { Endpoints } from '../../common/constants/Endpoints';
import {
  galleryDeleteController,
  galleryUploadController,
  getImageByCategoryController,
  getImagePathsForCategoryController,
} from '../controllers/Gallery';
import { hasRoleGuard } from '../guards/HasRole';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import { validator } from '../middleware/validators';
import routeHandler from '../utils/RouteHandler';
import FileWithMeta from '../validators/request/FileWithMeta';

export const startGalleryRoutes = (app: Express) => {
  app.post(
    Endpoints.galleryUpload,
    express.json({ limit: '50mb' }),
    express.urlencoded({ limit: '50mb', extended: true }),
    validator(checkSchema(FileWithMeta)),
    routeHandler({
      controller: galleryUploadController,
      guards: [hasRoleGuard('Admin'), hasValidAccessToken],
    })
  );

  app.post(
    Endpoints.galleryDelete,
    express.json(),
    routeHandler({
      controller: galleryDeleteController,
      guards: [hasRoleGuard('Admin'), hasValidAccessToken],
    })
  );

  app.get(
    Endpoints.galleryCategoryList,
    routeHandler({ controller: getImagePathsForCategoryController })
  );

  app.get(
    Endpoints.galleryGetImage,
    routeHandler({ controller: getImageByCategoryController })
  );
};
