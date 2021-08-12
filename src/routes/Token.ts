import { cookie } from 'express-validator';
import { Express } from 'express';
import { getNewAccessTokenController } from '../controllers/Token';
import { hasValidatedData } from '../guards/HasValidatedData';
import { hasValidRefreshToken } from '../guards/HasValidRefreshToken';
import routeHandler from '../utils/RouteHandler';
import { Endpoints } from '../../common/constants/Endpoints';

export const startTokenRoutes = (app: Express) => {
  app.post(
    Endpoints.refreshAccessToken,
    cookie('refreshToken').isString(),
    routeHandler({
      controller: getNewAccessTokenController,
      guards: [hasValidatedData, hasValidRefreshToken],
    })
  );
};
