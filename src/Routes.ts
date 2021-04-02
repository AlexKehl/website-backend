import { makeHttpResponse } from 'src/utils/HttpResponse';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { login, refreshToken } from 'src/Auth';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { getFileListForCategory } from 'src/FileList';
import { performFileUpload } from 'src/FileUpload';
import {
  validateLoginReq,
  validateTokenReq,
  validateFileUploadReq,
} from 'src/validators/middleware';
import { adaptRequest } from 'src/utils/RequestAdapter';
import { withTokenAuth } from 'src/utils/TokenAuth';
import { FileUpload, Login } from './types';

const start = (port: number) => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(fileUpload());
  app.use(
    cors({
      origin: 'http://127.0.0.1:3000',
      allowedHeaders: 'content-type',
      exposedHeaders: '*',
      credentials: true,
      preflightContinue: true,
    })
  );

  app.get('/', async (req: Request, res: Response) => {
    const httpRequest = adaptRequest(req);
    const fn = async () =>
      makeHttpResponse({
        statusCode: 200,
        data: {
          res: 'Hello!',
        },
      });

    const { headers, statusCode, data } = await withTokenAuth(fn)(httpRequest);

    res
      .set(headers)
      .status(statusCode)
      .send(data);
  });

  app.post('/login', validateLoginReq, async (req: Login, res: Response) => {
    const httpRequest = adaptRequest<Login>(req);
    const { headers, statusCode, data } = await login(httpRequest);
    res
      .set(headers)
      .status(statusCode)
      .send(data);

    // res.cookie('refreshToken', refreshToken, {
    //   sameSite: true,
    //   httpOnly: true,
    // });
    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   sameSite: true,
    // });
    // res.cookie('hasActiveToken', true);
  });

  app.post('/token', validateTokenReq, async (req, res) => {
    const httpRequest = adaptRequest(req);
    const { headers, statusCode, data } = await refreshToken(httpRequest);

    res
      .set(headers)
      .status(statusCode)
      .send(data);
  });

  app.get('/picturelist', async (req, res) => {
    if (!req.query.category) {
      res.sendStatus(500);
    }
    try {
      const files = getFileListForCategory(req.query.category);
      res.send(files);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.post(
    '/fileupload',
    validateFileUploadReq,
    async (req: FileUpload, res: Response) => {
      const httpRequest = adaptRequest<FileUpload>(req);
      const { headers, statusCode, data } = await performFileUpload(
        httpRequest
      );

      res
        .set(headers)
        .status(statusCode)
        .send(data);

      // try {
      //   const res = await performFileUpload({
      //     file: req.files.image,
      //     fileMeta: req.body.fileMeta,
      //   });
      //   res.send('OK');
      // } catch (e) {
      //   res.status(500).send(e.message);
      //   console.log(e);
      // }
    }
  );

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  return { app, server };
};

export { start };
