import express, { Express } from 'express';
import { fileUploadController } from '../controllers/Files';
import upload from '../utils/MulterConfig';
import routeHandler from '../utils/RouteHandler';

export const startFilesRoutes = (app: Express) => {
  app.post(
    '/file/upload',
    upload.single('file'),
    routeHandler({ controller: fileUploadController })
  );

  app.use('/files', express.static('pictures'));
};
