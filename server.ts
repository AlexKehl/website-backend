import { start } from './src/Routes';
import { connect } from 'mongoose';
import { DB_URL } from './config';

const main = async () => {
  await connect(`mongodb://${DB_URL}`, {
    dbName: 'main',
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  start(3002);
};

main();
