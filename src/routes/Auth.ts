import { body } from 'express-validator';
import express, { Express } from 'express';
import { loginController, registerController } from '../controllers/Auth';
import routeHandler from '../utils/RouteHandler';
import { Endpoints } from '../../common/constants/Endpoints';
import { validator } from '../middleware/validators';

export const startAuthRoutes = (app: Express) => {
  app.post(
    Endpoints.register,
    express.json(),
    validator(body('email').isEmail()),
    validator(body('password').isLength({ min: 8 })),
    routeHandler({ controller: registerController })
  );

  app.post(
    Endpoints.login,
    express.json(),
    validator(body('email').isEmail()),
    validator(body('password').isLength({ min: 8 })),
    routeHandler({ controller: loginController })
  );
};
