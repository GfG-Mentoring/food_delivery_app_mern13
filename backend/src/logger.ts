import winston from 'winston';

import { env } from './config/env.js';

const isProd = env.nodeEnv === 'production';

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: isProd
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const extra =
            Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return `${String(timestamp)} ${level}: ${String(message)}${extra}`;
        }),
      ),
  transports: [new winston.transports.Console()],
});
