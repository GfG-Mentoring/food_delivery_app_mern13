import type { NextFunction, Request, Response } from 'express';

import { logger } from '../logger.js';
import { AppError } from '../utils/errors.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}
