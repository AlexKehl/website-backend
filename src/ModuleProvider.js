/* global process */

const jwt = require('jsonwebtoken');

const ModuleProvider = ({ itemsDb }) => {
  const env = process.env;
  const Auth = require('./Auth')({
    env,
    itemsDb,
    jwt,
  });

  return { Auth };
};
module.exports = ModuleProvider;
