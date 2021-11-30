import express, { Express } from 'express';
import { Endpoints } from '../../common/constants/Endpoints';
import { contactInformationController } from '../controllers/UserInfo';
import { hasValidAccessToken } from '../guards/HasValidAccessToken';
import routeHandler from '../utils/RouteHandler';

export const startUserInfoRoutes = (app: Express) => {
  app.post(
    Endpoints.contactInformation,
    express.json(),
    routeHandler({
      controller: contactInformationController,
      guards: [hasValidAccessToken],
    })
  );
};
