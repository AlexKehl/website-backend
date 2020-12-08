/* global process */

import * as jwt from 'jsonwebtoken';
import DbFn from './db';
import AuthFn from './Auth';
import RoutesFn from './routes';
import * as mongodb from 'mongodb';

const ModuleProvider = ({ mainDb }: { mainDb: mongodb.Db }) => {
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
