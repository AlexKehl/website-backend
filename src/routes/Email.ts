import express, { Express } from 'express';
import { body } from 'express-validator';
import { Endpoints } from '../../common/constants/Endpoints';
import { emailConfirmController } from '../controllers/Email';
import { validator } from '../middleware/validators';
import routeHandler from '../utils/RouteHandler';

export const startEmailRoutes = (app: Express) => {
  app.post(
    Endpoints.emailConfirm,
    express.json(),
    validator(body('token').isString()),
    routeHandler({ controller: emailConfirmController })
  );
};
