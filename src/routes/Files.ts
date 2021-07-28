import { Express } from 'express';
import { body } from 'express-validator';
import {
  fileDeleteController,
  fileUploadController,
  getImageByCategoryController,
  getImagePathsForCategoryController,
} from '../controllers/Files';
import { hasFileAttached } from '../guards/HasFileAttached';
import { hasValidatedData } from '../guards/HasValidatedData';
import upload from '../utils/MulterConfig';
import routeHandler from '../utils/RouteHandler';

export const startFilesRoutes = (app: Express) => {
  app.post(
    '/file/upload',
    upload.single('file'),
    body('category').isString(),
    routeHandler({
      controller: fileUploadController,
      guards: [hasFileAttached, hasValidatedData],
    })
  );

  app.post(
    '/file/delete',
    body('category').isString(),
    body('name').isString(),
    routeHandler({
      controller: fileDeleteController,
      guards: [hasValidatedData],
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
