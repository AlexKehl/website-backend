const { start } = require('src/Routes.js');
const { connect } = require('mongoose');
const { config } = require('dotenv');

config();

const main = async () => {
  await connect(
    `mongodb://${process.env.DB_URL}`,
    { dbName: 'main', useUnifiedTopology: true, useNewUrlParser: true }
  );
  start(3002);
};

main();
