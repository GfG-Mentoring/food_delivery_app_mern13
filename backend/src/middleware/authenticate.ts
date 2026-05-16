import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../services/auth.service.js';
import { AppError } from '../utils/errors.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith('Bearer ')) {
    next(new AppError(401, 'Unauthorized'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (token.length === 0) {
    next(new AppError(401, 'Unauthorized'));
    return;
  }

  try {
    const { sub } = verifyAccessToken(token);
    req.authUserId = sub;
    next();
  } catch {
    next(new AppError(401, 'Unauthorized'));
  }
}
