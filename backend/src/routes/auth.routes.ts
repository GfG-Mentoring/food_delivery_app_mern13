import express from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { User } from '../models/user.model.js';
import {
  hashPassword,
  signAccessToken,
  verifyPassword,
} from '../services/auth.service.js';
import { AppError } from '../utils/errors.js';

const router = express.Router();

const MIN_PASSWORD_LENGTH = 8;

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isMongoDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 11_000
  );
}

function toPublicUser(doc: {
  _id: unknown;
  email: string;
  name: string;
  createdAt?: Date;
}): {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
} {
  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name,
    ...(doc.createdAt !== undefined
      ? { createdAt: doc.createdAt.toISOString() }
      : {}),
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const body = req.body as {
      email?: unknown;
      password?: unknown;
      name?: unknown;
    };

    if (
      typeof body.name !== 'string' ||
      body.name.trim().length === 0 ||
      typeof body.email !== 'string' ||
      body.email.trim().length === 0 ||
      typeof body.password !== 'string'
    ) {
      throw new AppError(400, 'name, email, and password are required');
    }

    if (body.password.length < MIN_PASSWORD_LENGTH) {
      throw new AppError(
        400,
        `password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
    }

    const email = normalizeEmail(body.email);
    const name = body.name.trim();
    const passwordHash = await hashPassword(body.password);

    try {
      const user = await User.create({
        email,
        name,
        passwordHash,
      });

      const token = signAccessToken(String(user._id));
      res.status(201).json({
        token,
        user: toPublicUser(user),
      });
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        throw new AppError(409, 'Email already registered');
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = req.body as { email?: unknown; password?: unknown };

    if (
      typeof body.email !== 'string' ||
      body.email.trim().length === 0 ||
      typeof body.password !== 'string' ||
      body.password.length === 0
    ) {
      throw new AppError(400, 'email and password are required');
    }

    const email = normalizeEmail(body.email);

    const user = await User.findOne({ email })
      .select('+passwordHash')
      .exec();

    if (user === null) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordOk = await verifyPassword(body.password, user.passwordHash);
    if (!passwordOk) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signAccessToken(String(user._id));
    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const id = req.authUserId;
    if (id === undefined) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await User.findById(id).exec();
    if (user === null) {
      throw new AppError(401, 'Unauthorized');
    }

    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
