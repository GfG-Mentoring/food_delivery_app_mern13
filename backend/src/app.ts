/// <reference path="./types/express.d.ts" />

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

/**
 * Vercel Services routes `/_/backend/*` to this app but strips `/_/backend` before
 * invoking Express, so routes must be mounted at `/`. Locally and in tests there is no prefix.
 */
function apiRoutePrefix(): string {
  const explicit = process.env.API_ROUTE_PREFIX?.trim();
  if (explicit !== undefined && explicit !== '') {
    return explicit.replace(/\/$/, '');
  }
  return '';
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

  /** Vercel: connect Mongo only for routes that need it so /health and API root can respond if DB is slow or misconfigured. */
  const onVercel = process.env.VERCEL === '1';

  function connectDbMiddleware(
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ): void {
    void ensureDbConnected(env.mongodbUri).then(next).catch(next);
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

  const api = express.Router();

  api.get('/', (_req, res) => {
    res.json({ ok: true, service: 'food-delivery-api' });
  });

  api.use('/health', healthRoutes);

  if (onVercel) {
    api.use('/auth', connectDbMiddleware, authRoutes);
    api.use('/restaurants', connectDbMiddleware, restaurantsRoutes);
  } else {
    api.use('/auth', authRoutes);
    api.use('/restaurants', restaurantsRoutes);
  }

  const prefix = apiRoutePrefix();
  if (prefix !== '') {
    app.use(prefix, api);
  } else {
    app.use(api);
  }

  app.use(errorHandler);

  return app;
}
