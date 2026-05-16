/**
 * Runs before test files load so `config/env` reads stable values in CI/local
 * without requiring a real MongoDB or secrets on disk.
 */
process.env.NODE_ENV ??= 'test';

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/vitest-placeholder';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'vitest-jwt-secret-minimum-32-characters-long';
}

if (!process.env.BCRYPT_COST) {
  process.env.BCRYPT_COST = '4';
}

if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '1h';
}
