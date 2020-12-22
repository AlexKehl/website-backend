const express = require('express');
const cors = require('cors');
const { login, refreshToken, authenticateToken } = require('src/Auth.js');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

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

  const tokenMiddleWare = (req, res, next) => {
    try {
      authenticateToken(req.headers);
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  };

  app.get('/', tokenMiddleWare, (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.post('/login', async (req, res) => {
    try {
      const { accessToken, refreshToken } = await login({
        email: req.body.email,
        password: req.body.password,
      });

      res.cookie('refreshToken', refreshToken, {
        sameSite: true,
        httpOnly: true,
      });
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: true,
      });
      res.cookie('hasActiveToken', true);
      res.send({ accessToken, refreshToken });
    } catch (e) {
      res.sendStatus(e.status || 401);
    }
  });

  app.post('/token', async (req, res) => {
    try {
      const { accessToken } = await refreshToken({
        email: req.body.email,
        refreshToken: req.body.refreshToken,
      });
      res.status(200).json({ accessToken });
    } catch (e) {
      res.sendStatus(e.status || 403);
    }
  });

  app.post('/fileupload', async (req, res) => {
    console.log(req.body);

    res.send('ok');
    // const file = req.files.image;
    //
    // if (!('mv' in file)) {
    //   res.sendStatus(500);
    // }
    //
    // try {
    //   const mvRes = await file.mv(`./${file.name}`);
    //   res.send('OK');
    // } catch (e) {
    //   res.sendStatus(500);
    //   console.log(e);
    // }
  });

  const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  return { app, server };
};

module.exports = { start };
