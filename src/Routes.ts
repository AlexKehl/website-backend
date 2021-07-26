import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import routeHandler from './utils/RouteHandler';
import { loginController, registerController } from './controllers/Auth';
import { body } from 'express-validator';
import { hasValidatedData } from './guards/HasValidatedData';
import { getNewAccessTokenController } from './controllers/Token';
import { hasValidRefreshToken } from './guards/HasValidRefreshToken';
import { ServerStartOptions } from './types';

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

  app.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    routeHandler({ controller: registerController, guards: [hasValidatedData] })
  );

  app.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    routeHandler({ controller: loginController, guards: [hasValidatedData] })
  );

  app.post(
    '/refreshtoken',
    body('email').isEmail(),
    body('refreshToken').isString(),
    routeHandler({
      controller: getNewAccessTokenController,
      guards: [hasValidatedData, hasValidRefreshToken],
    })
  );

  const server = app.listen(port, () => {
    if (startupMessage) {
      console.log(startupMessage);
    }
  });

  return { app, server };
};

export { start };
