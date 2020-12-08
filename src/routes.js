const Routes = ({ Auth }) => {
  const express = require('express');
  const cors = require('cors');

  const start = port => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', Auth.authenticateToken, (req, res) => {
      res.json({
        message: 'Hello world!',
      });
    });

    app.post('/login', async (req, res) => {
      try {
        const { accessToken, refreshToken } = await Auth.login({
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
        const { accessToken } = await Auth.refreshToken({
          email: req.body.email,
          refreshToken: req.body.refreshToken,
        });
        res.json({ accessToken });
      } catch (e) {
        res.sendStatus(e.status || 403);
      }
    });

    const server = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });

    return { app, server };
  };

  return { start };
};

module.exports = Routes;
