import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import routeHandler from './utils/RouteHandler';
import { loginController, registerController } from './controllers/Auth';
import { body } from 'express-validator';
import { hasValidatedData } from './guards/HasValidatedData';
import { getNewAccessTokenController } from './controllers/Token';
import { hasValidRefreshToken } from './guards/HasValidRefreshToken';

const start = (port: number) => {
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
    routeHandler({
      controller: getNewAccessTokenController,
      guards: [hasValidRefreshToken],
    })
  );

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  return { app, server };
};

export { start };
