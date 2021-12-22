import express, { Express } from 'express';
import { Endpoints } from '../../common/constants/Endpoints';
import {
  postAddressInformationController,
  postContactInformationController,
} from '../controllers/UserInfo';
import { hasValidAccessTokenGuard } from '../middleware/guards';
import routeHandler from '../utils/RouteHandler';

export const startUserInfoRoutes = (app: Express) => {
  app.post(
    Endpoints.contactInformation,
    express.json(),
    hasValidAccessTokenGuard,
    routeHandler({ controller: postContactInformationController })
  );

  app.post(
    Endpoints.addressInformation,
    express.json(),
    hasValidAccessTokenGuard,
    routeHandler({ controller: postAddressInformationController })
  );
};
