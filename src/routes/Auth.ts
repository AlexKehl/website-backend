import { body, cookie } from 'express-validator';
import { Express } from 'express';
import {
  registerController,
  loginController,
  logoutController,
} from '../controllers/Auth';
import { getNewAccessTokenController } from '../controllers/Token';
import { hasValidatedData } from '../guards/HasValidatedData';
import { hasValidRefreshToken } from '../guards/HasValidRefreshToken';
import routeHandler from '../utils/RouteHandler';

export const startAuthRoutes = (app: Express) => {
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
    cookie('refreshToken').isString(),
    routeHandler({
      controller: getNewAccessTokenController,
      guards: [hasValidatedData, hasValidRefreshToken],
    })
  );

  app.post(
    '/logout',
    body('email').isEmail(),
    cookie('refreshToken').isString(),
    routeHandler({
      controller: logoutController,
      guards: [hasValidatedData, hasValidRefreshToken],
    })
  );
};
