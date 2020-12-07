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

  return { Auth };
};
module.exports = ModuleProvider;
