/* global process */

const jwt = require('jsonwebtoken');

const ModuleProvider = ({ mainDb }) => {
  const env = process.env;
  const Db = require('./db')({ mainDb });
  const Auth = require('./Auth')({
    env,
    Db,
    jwt,
  });
  const Routes = require('./routes')({ mainDb, Auth });

  return { Auth, Routes, Db };
};
module.exports = ModuleProvider;
