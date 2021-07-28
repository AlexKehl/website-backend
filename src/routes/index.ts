import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { ServerStartOptions } from '../types';
import { startAuthRoutes } from './Auth';
import { startFilesRoutes } from './Files';

const start = ({ port, startupMessage }: ServerStartOptions) => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://127.0.0.1:3000',
      allowedHeaders: 'content-type',
      exposedHeaders: '*',
      credentials: true,
      preflightContinue: true,
    })
  );

  startAuthRoutes(app);
  startFilesRoutes(app);

  const server = app.listen(port, () => {
    if (startupMessage) {
      console.log(startupMessage);
    }
  });

  return { app, server };
};

export { start };
