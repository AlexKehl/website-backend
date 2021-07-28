import express, { Express } from 'express';
import {
  fileDeleteController,
  fileUploadController,
  getImagePathsForCategoryController,
} from '../controllers/Files';
import { getImagePathsForCategory } from '../services/Files';
import upload from '../utils/MulterConfig';
import routeHandler from '../utils/RouteHandler';

export const startFilesRoutes = (app: Express) => {
  app.post(
    '/file/upload',
    upload.single('file'),
    routeHandler({ controller: fileUploadController })
  );

  app.post('/file/delete', routeHandler({ controller: fileDeleteController }));

  app.get(
    '/files/:category',
    routeHandler({ controller: getImagePathsForCategoryController })
  );

  // app.use('/files', express.static('pictures'));
};
