import { start } from './src/Routes';
import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

const main = async () => {
  await connect(
    `mongodb://${process.env.DB_URL}`,
    { dbName: 'main' },
  );
  start(3001);
};

main();
