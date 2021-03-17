const { config } = require('dotenv');
const { connect, disconnect } = require('mongoose');

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

module.exports = {
  setupModelTest,
};
