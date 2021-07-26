import { start } from './src/Routes';
import { connect } from 'mongoose';
import { DB_URL } from './config';

const main = async () => {
  await connect(`mongodb://${DB_URL}`, {
    dbName: 'main',
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  start({
    port: 3002,
    startupMessage: `Server listening at http://localhost:${3002}`,
  });
};

main();
