import bcrypt from 'bcrypt';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.bcryptCost);
}

export async function verifyPassword(
  plain: string,
  passwordHash: string | undefined,
): Promise<boolean> {
  if (
    typeof plain !== 'string' ||
    plain.length === 0 ||
    typeof passwordHash !== 'string' ||
    passwordHash.length === 0
  ) {
    return false;
  }
  return bcrypt.compare(plain, passwordHash);
}

export function signAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    env.jwtSecret as Secret,
    {
      algorithm: 'HS256',
      expiresIn: env.jwtExpiresIn,
    } as SignOptions,
  );
}

export type AccessTokenPayload = { sub: string };

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret as Secret, {
    algorithms: ['HS256'],
  });

  if (
    typeof decoded === 'string' ||
    decoded === null ||
    typeof decoded !== 'object' ||
    typeof decoded.sub !== 'string'
  ) {
    throw new Error('Invalid token payload');
  }

  return { sub: decoded.sub };
}
