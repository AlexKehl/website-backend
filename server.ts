/* global process */

import { config } from 'dotenv';
import ModuleProviderFn from './src/ModuleProvider';
config();

import { MongoClient } from 'mongodb';

MongoClient.connect(`mongodb://${process.env.DB_URL}`, {
  useUnifiedTopology: true,
}).then(client => {
  const mainDb = client.db('main');
  const { Routes } = ModuleProviderFn({ mainDb });
  Routes.start(3001);
});
