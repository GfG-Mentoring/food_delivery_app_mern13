import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './lib/db.js';
import { logger } from './logger.js';

function isQuerySrvNotFound(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 'ENOTFOUND' &&
    'syscall' in err &&
    err.syscall === 'querySrv'
  );
}

async function main(): Promise<void> {
  logger.info('Connecting to MongoDB…');
  try {
    await connectDb(env.mongodbUri);
  } catch (err: unknown) {
    logger.error(
      'MongoDB connection failed. Use a reachable MONGODB_URI, or set MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER (full Atlas host), and MONGO_DATABASE; or run local MongoDB (default mongodb://127.0.0.1:27017/food-delivery).',
    );
    if (isQuerySrvNotFound(err)) {
      logger.error(
        'mongodb+srv DNS error: MONGO_CLUSTER must be the full hostname (cluster0.xxxxx.mongodb.net), not a short cluster name.',
      );
    }
    logger.error(err);
    process.exit(1);
  }
  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    server.close(() => {
      void disconnectDb()
        .then(() => process.exit(0))
        .catch((err: unknown) => {
          logger.error(err);
          process.exit(1);
        });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

void main().catch((err: unknown) => {
  logger.error(err);
  process.exit(1);
});
