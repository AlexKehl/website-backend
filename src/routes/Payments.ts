import express, { Express } from 'express';
import { Endpoints } from '../../common/constants/Endpoints';
import { checkoutController, webHookController } from '../controllers/Payments';
import { hasValidAccessTokenGuard } from '../middleware/guards';
import routeHandler from '../utils/RouteHandler';

export const startPaymentRoutes = (app: Express) => {
  app.post(
    Endpoints.checkout,
    express.json(),
    hasValidAccessTokenGuard,
    routeHandler({ controller: checkoutController })
  );

  app.post(
    Endpoints.webhook,
    express.raw({ type: 'application/json' }),
    routeHandler({ controller: webHookController })
  );
};
