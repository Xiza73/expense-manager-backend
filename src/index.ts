import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { app } from './config/server.config';
import { AppDataSource } from './data-source';
import { handleErrorMessage } from './utils/error.util';

AppDataSource.initialize()
  .then(async () => {
    logger.info('Data Source has been initialized!');

    const server = app.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env;
      logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
    });

    const onCloseSignal = () => {
      logger.info('sigint received, shutting down');
      server.close(() => {
        logger.info('server closed');
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    };

    process.on('SIGINT', onCloseSignal);
    process.on('SIGTERM', onCloseSignal);
  })
  .catch((error) => {
    // logger.error('Error during Data Source initialization', error);
    logger.error(handleErrorMessage('Error during Data Source initialization', error));
    process.exit(1);
  });
