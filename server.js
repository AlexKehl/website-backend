/* global process */

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(`mongodb://${process.env.DB_URL}`, {
  useUnifiedTopology: true,
}).then(client => {
  const mainDb = client.db('main');
  const { Auth } = require('./src/ModuleProvider')({ mainDb });
  const express = require('express');
  const cors = require('cors');

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', Auth.authenticateToken, (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.post('/login', async (req, res) => {
    const { accessToken, refreshToken } = await Auth.login({
      email: req.body.email,
      password: req.body.password,
    });

    res.json({ accessToken, refreshToken });
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

  const port = 3001;

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
