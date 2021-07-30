import { Express } from 'express';
import { body } from 'express-validator';
import {
  fileSyncController,
  getImageByCategoryController,
  getImagePathsForCategoryController,
} from '../controllers/Files';
import { hasFilesAttached } from '../guards/HasFileAttached';
import { hasValidatedData } from '../guards/HasValidatedData';
import upload from '../utils/MulterConfig';
import routeHandler from '../utils/RouteHandler';

export const startFilesRoutes = (app: Express) => {
  app.post(
    '/file/sync/gallery',
    upload.array('files'),
    body('category').isString(),
    routeHandler({
      controller: fileSyncController,
      guards: [hasValidatedData, hasFilesAttached],
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
