const { config } = require('dotenv');
const { connect, disconnect } = require('mongoose');
const { start } = require('src/Routes');

config();

const setupModelTest = (model, collection) => {
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
  let serverRef;
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

module.exports = {
  setupModelTest,
  mockServer,
};
