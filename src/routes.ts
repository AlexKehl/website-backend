import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { login, refreshToken, authenticateToken } from './Auth';

const start = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const tokenMiddleWare = (req: Request, res: Response, next: NextFunction) => {
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

      res.json({ accessToken, refreshToken });
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

  const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  return { app, server };
};

export { start };
