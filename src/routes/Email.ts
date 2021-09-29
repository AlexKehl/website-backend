import { Express } from 'express';
import { body } from 'express-validator';
import { Endpoints } from '../../common/constants/Endpoints';
import { emailConfirmController } from '../controllers/Email';
import { hasValidatedData } from '../guards/HasValidatedData';
import routeHandler from '../utils/RouteHandler';

export const startEmailRoutes = (app: Express) => {
  app.post(
    Endpoints.emailConfirm,
    body('token').isString(),
    routeHandler({
      controller: emailConfirmController,
      guards: [hasValidatedData],
    })
  );
};
