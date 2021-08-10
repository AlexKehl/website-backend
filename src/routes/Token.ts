import { cookie } from 'express-validator';
import { Express } from 'express';
import { getNewAccessTokenController } from '../controllers/Token';
import { hasValidatedData } from '../guards/HasValidatedData';
import { hasValidRefreshToken } from '../guards/HasValidRefreshToken';
import routeHandler from '../utils/RouteHandler';

export const startTokenRoutes = (app: Express) => {
  app.post(
    '/refreshtoken',
    cookie('refreshToken').isString(),
    routeHandler({
      controller: getNewAccessTokenController,
      guards: [hasValidatedData, hasValidRefreshToken],
    })
  );
};
