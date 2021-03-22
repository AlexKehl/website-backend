const { makeHttpResponse } = require('src/utils/HttpResponse');
const express = require('express');
const cors = require('cors');
const { login, refreshToken } = require('src/Auth.js');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { getFileListForCategory } = require('src/FileList');
const { performFileUpload } = require('src/FileUpload');
const {
  validateLoginReq,
  validateTokenReq,
  validateFileUploadReq,
} = require('src/validators/middleware');
const { adaptRequest } = require('src/utils/RequestAdapter');
const { withTokenAuth } = require('src/utils/TokenAuth');

const start = port => {
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

  // const tokenMiddleWare = (req, res, next) => {
  //   try {
  //     authenticateToken(req.headers);
  //     next();
  //   } catch (e) {
  //     res.sendStatus(403);
  //   }
  // };

  app.get('/', async (req, res) => {
    const httpRequest = adaptRequest(req);
    const fn = () =>
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

  app.post('/login', validateLoginReq, async (req, res) => {
    const httpRequest = adaptRequest(req);
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

  app.post('/fileupload', validateFileUploadReq, async (req, res) => {
    const httpRequest = adaptRequest(req);
    const { headers, statusCode, data } = await performFileUpload(httpRequest);

    res
      .set(headers)
      .status(statusCode)
      .send(data);

    try {
      const res = await performFileUpload({
        file: req.files.image,
        fileMeta: req.body.fileMeta,
      });
      res.send('OK');
    } catch (e) {
      res.status(500).send(e.message);
      console.log(e);
    }
  });

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  return { app, server };
};

module.exports = { start };
