import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ServerStartOptions } from '../types';
import { startAuthRoutes } from './Auth';
import { startGalleryRoutes } from './Gallery';
import { CLIENT_URL, LOG_REQUESTS } from '../../config';
import morgan from 'morgan';
import { startEmailRoutes } from './Email';
import { startPaymentRoutes } from './Payments';
import express from 'express';
import { startUserInfoRoutes } from './UserInfo';
import { startProfileRoutes } from './Profile';
const start = ({ port, startupMessage }: ServerStartOptions) => {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
      preflightContinue: true,
    })
  );
  if (LOG_REQUESTS) {
    app.use(morgan('combined'));
  }

  startAuthRoutes(app);
  startGalleryRoutes(app);
  startEmailRoutes(app);
  startPaymentRoutes(app);
  startUserInfoRoutes(app);
  startProfileRoutes(app);

  const server = app.listen(port, () => {
    if (startupMessage) {
      console.log(startupMessage);
    }
  });

  return { app, server };
};

export { start };
