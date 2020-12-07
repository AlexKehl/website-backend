/* global process */

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(`mongodb://${process.env.DB_URL}`, {
  useUnifiedTopology: true,
}).then(client => {
  const mainDb = client.db('main');
  const { Routes } = require('./src/ModuleProvider')({ mainDb });
  Routes.start(3001);
});
