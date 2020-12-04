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

  app.post('/login', Auth.login);

  app.post('/token', Auth.refreshToken);

  const port = 3001;

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
