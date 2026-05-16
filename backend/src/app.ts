import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { logger } from './logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import restaurantsRoutes from './routes/restaurants.routes.js';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());

  /* Dev / local tooling: browser clients (e.g. Vite) may hit the API cross-origin */
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    app.use(cors());
  }

  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => {
          logger.http(message.trim());
        },
      },
    }),
  );

  app.use('/health', healthRoutes);
  app.use('/auth', authRoutes);
  app.use('/restaurants', restaurantsRoutes);

  app.use(errorHandler);

  return app;
}
