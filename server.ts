import { start } from './src/Routes';
import { connect } from 'mongoose';
import { DB_URL } from './config';
import { logger } from './src/utils/Logger';

const main = async () => {
  await connect(`mongodb://${DB_URL}`, {
    dbName: 'main',
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  try {
    start({
      port: 3002,
      startupMessage: `Server listening at http://localhost:${3002}`,
    });
  } catch (e) {
    logger.log({ level: 'error', message: e.message });
  }
};

main();
