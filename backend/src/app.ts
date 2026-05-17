import path from 'node:path';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { env } from './config/env.js';
import { ensureDbConnected } from './lib/db.js';
import { logger } from './logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import restaurantsRoutes from './routes/restaurants.routes.js';

function corsOriginsProduction(): false | string[] {
  const commaList = (
    process.env.ALLOWED_ORIGINS ??
    process.env.FRONTEND_URL ??
    ''
  ).trim();
  if (commaList === '') {
    return false;
  }
  const list = commaList.split(',').map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : false;
}

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());

  /* Dev / local tooling: browser clients (e.g. Vite) may hit the API cross-origin */
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    app.use(cors());
  } else {
    const origins = corsOriginsProduction();
    if (origins !== false) {
      app.use(
        cors({
          origin: origins,
          credentials: true,
        }),
      );
    }
  }

  /** Vercel runs this build as a Function; defer DB connection to first request after cold start */
  const onVercel = process.env.VERCEL === '1';
  if (onVercel) {
    app.use((_req, _res, next) => {
      void ensureDbConnected(env.mongodbUri).then(next).catch(next);
    });
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

  /**
   * Non-file routes (e.g. /r/:id) are not served from public/; CDN misses fall through to this
   * function with only API paths routed above.
   */
  if (onVercel) {
    const indexHtml = path.join(process.cwd(), 'public', 'index.html');
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (
        req.path.startsWith('/health') ||
        req.path.startsWith('/auth') ||
        req.path.startsWith('/restaurants')
      ) {
        return next();
      }
      res.sendFile(indexHtml, (err) => (err ? next(err) : undefined));
    });
  }

  app.use(errorHandler);

  return app;
}
