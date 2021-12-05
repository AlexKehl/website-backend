import { start } from './src/routes';
import { connect } from 'mongoose';
import { DB_URL } from './config';
import { logger } from './src/utils/Logger';
import { sendMessage, startTelegramBot } from './src/services/Telegram';

const main = async () => {
  await connect(`mongodb://${DB_URL}`, { dbName: 'main' });
  try {
    start({
      port: 3002,
      startupMessage: `Server listening at http://localhost:${3002}`,
    });
    startTelegramBot();
  } catch (e) {
    if (e instanceof Error) {
      logger.log({ level: 'error', message: e.message });
    }
  }
};

main();
