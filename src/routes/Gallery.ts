import express, { Express } from 'express';
import { checkSchema } from 'express-validator';
import { Endpoints } from '../../common/constants/Endpoints';
import {
  galleryDeleteController,
  galleryUploadController,
  getImageByCategoryController,
  getImagePathsForCategoryController,
} from '../controllers/Gallery';
import { hasRoleGuard, hasValidAccessTokenGuard } from '../middleware/guards';
import { validator } from '../middleware/validators';
import routeHandler from '../utils/RouteHandler';
import FileWithMeta from '../validators/request/FileWithMeta';

export const startGalleryRoutes = (app: Express) => {
  app.post(
    Endpoints.galleryUpload,
    express.json({ limit: '50mb' }),
    express.urlencoded({ limit: '50mb', extended: true }),
    validator(checkSchema(FileWithMeta)),
    hasValidAccessTokenGuard,
    hasRoleGuard('Admin'),
    routeHandler({ controller: galleryUploadController })
  );

  app.post(
    Endpoints.galleryDelete,
    express.json(),
    hasValidAccessTokenGuard,
    hasRoleGuard('Admin'),
    routeHandler({ controller: galleryDeleteController })
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
