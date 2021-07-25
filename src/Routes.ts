import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { makeHttpResponse } from './utils/HttpResponse';
import { ExpressObj } from './types';
import routeHandler from './utils/RouteHandler';
import { loginController } from './controllers/Auth';
import { hasValidToken } from './guards/HasValidToken';
import { body, validationResult } from 'express-validator';
import { hasValidatedData } from './guards/HasValidatedData';

const start = (port: number) => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://127.0.0.1:3000',
      allowedHeaders: 'content-type',
      exposedHeaders: '*',
      credentials: true,
      preflightContinue: true,
    })
  );

  const testHandler = async ({ res }: ExpressObj) => {
    const { data, headers, statusCode } = makeHttpResponse({
      statusCode: 200,
      data: {
        res: 'Hello!',
      },
    });

    res.set(headers).status(statusCode).send(data);
  };

  app.get(
    '/',
    routeHandler({ controller: testHandler, guards: [hasValidToken] })
  );

  // app.post('/register', routeHandler({ controller: registerHandler }));

  app.post(
    '/login',
    body('email').isEmail(),
    routeHandler({ controller: loginController, guards: [hasValidatedData] })
  );

  // app.post('/refreshtoken', async (req, res) => {
  //   const httpRequest = adaptRequest(req);
  //   const { headers, statusCode, data } = await refreshAccessToken(httpRequest);
  //
  //   res.set(headers).status(statusCode).send(data);
  // });

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  return { app, server };
};

export { start };
