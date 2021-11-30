import { body } from 'express-validator';
import express, { Express } from 'express';
import {
  registerController,
  loginController,
  logoutController,
} from '../controllers/Auth';
import { hasValidatedData } from '../guards/HasValidatedData';
import routeHandler from '../utils/RouteHandler';
import { Endpoints } from '../../common/constants/Endpoints';

export const startAuthRoutes = (app: Express) => {
  app.post(
    Endpoints.register,
    express.json(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    routeHandler({ controller: registerController, guards: [hasValidatedData] })
  );

  app.post(
    Endpoints.login,
    express.json(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    routeHandler({ controller: loginController, guards: [hasValidatedData] })
  );

  app.post(
    Endpoints.logout,
    express.json(),
    routeHandler({
      controller: logoutController,
    })
  );
};
