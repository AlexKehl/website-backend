import { connect, connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { start } from '../src/routes';
import { ServerStartOptions } from '../src/types';

let mongod: MongoMemoryServer;

export const connectToDb = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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
