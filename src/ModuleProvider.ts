/* global process */

import * as jwt from 'jsonwebtoken';
import DbFn from './db';
import AuthFn from './Auth';
import RoutesFn from './routes';

const ModuleProvider = ({ mainDb }) => {
  const env = process.env;
  const Db = DbFn({ mainDb });
  const Auth = AuthFn({
    env,
    Db,
    jwt,
  });
  const Routes = RoutesFn({ Auth });

  return { Auth, Routes, Db };
};

export default ModuleProvider;
