import { config } from 'dotenv';
import { connect, disconnect, Model } from 'mongoose';
import { Server } from 'node:http';
import { start } from '../src/Routes';

config();

const setupModelTest = <T extends typeof Model>(
  model: T,
  collection: string
) => {
  beforeAll(async () => {
    await connect(
      `mongodb://${process.env.TEST_DB_URL}/${collection}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  afterEach(async () => {
    await model.deleteMany();
  });

  afterAll(async () => {
    await disconnect();
  });
};

const mockServer = () => {
  let serverRef: Server;
  const startServer = async () => {
    await connect(
      `mongodb://${process.env.DB_URL}`,
      { dbName: 'main', useUnifiedTopology: true, useNewUrlParser: true }
    );

    const { app, server } = start(3006);

    serverRef = server;
    return app;
  };

  const stopServer = async () => {
    serverRef.close();
    await disconnect();
  };

  return {
    stopServer,
    startServer,
  };
};

export { setupModelTest, mockServer };
