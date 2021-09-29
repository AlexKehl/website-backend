import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { ServerStartOptions } from '../types';
import { startAuthRoutes } from './Auth';
import { startGalleryRoutes } from './Gallery';
import { CLIENT_URL, LOG_REQUESTS } from '../../config';
import { startTokenRoutes } from './Token';
import * as morgan from 'morgan';
import { startEmailRoutes } from './Email';
import { startPaymentRoutes } from './Payments';
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
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  startAuthRoutes(app);
  startGalleryRoutes(app);
  startTokenRoutes(app);
  startEmailRoutes(app);
  startPaymentRoutes(app);

  const server = app.listen(port, () => {
    if (startupMessage) {
      console.log(startupMessage);
    }
  });

  return { app, server };
};

export { start };
