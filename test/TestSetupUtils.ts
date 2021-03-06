import { Express } from 'express';
import { connect, connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { start } from '../src/routes';
import { ServerStartOptions } from '../src/types';
import { createUser } from '../src/services/Users';
import { Endpoints } from '../common/constants/Endpoints';
import supertest from 'supertest';
import { UserDoc } from '../src/model/User';

let mongod: MongoMemoryServer;

export const connectToDb = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await connect(uri);
};

export const closeDatabase = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};

export const clearDatabase = async () => {
  const collections = connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const setupDb = () => {
  beforeAll(async () => await connectToDb());

  afterEach(async () => await clearDatabase());

  afterAll(async () => await closeDatabase());
};

export const getUniqPort = () => {
  return Math.floor(Math.random() * (65535 - 1024)) + 1024;
};

export const setupServer = (options: ServerStartOptions) => {
  const { app, server } = start(options);
  beforeAll(async () => {
    await connectToDb();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    server.close();
  });
  return { app, server };
};

export const getLoggedInCookie =
  (app: Express) =>
  async (user: UserDoc): Promise<['Cookie', string[]]> => {
    await createUser(user);
    const loginRes = await supertest(app)
      .post(Endpoints.login)
      .send({ email: user.email, password: '12345678' });

    return ['Cookie', [`accessToken=${loginRes.body.accessToken}`]];
  };
