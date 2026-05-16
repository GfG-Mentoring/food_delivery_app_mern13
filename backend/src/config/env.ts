function parsePort(value: string | undefined, defaultPort: number): number {
  if (value === undefined || value === '') {
    return defaultPort;
  }
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid PORT: ${value}`);
  }
  return n;
}

function firstNonEmpty(
  ...values: (string | undefined)[]
): string | undefined {
  for (const v of values) {
    if (v !== undefined && v !== '') {
      return v;
    }
  }
  return undefined;
}

/**
 * Atlas "cluster" must be a real DNS name (e.g. cluster0.abc123.mongodb.net).
 * Short labels like "cluster0" make mongodb+srv query _mongodb._tcp.cluster0 and fail with ENOTFOUND.
 */

function assertAtlasClusterHost(host: string): void {
  if(!host){
    throw new Error('MongoDB cluster host is required');
  }
}
/**
 * Resolves MongoDB connection URI:
 * 1. MONGODB_URI if set (full override)
 * 2. Atlas-style parts: username, password, cluster host, database → mongodb+srv://…
 * 3. Local default for dev
 */
function resolveMongoUri(): string {
  const explicit = firstNonEmpty(process.env.MONGODB_URI);
  if (explicit) {
    return explicit;
  }

  const username = firstNonEmpty(
    process.env.MONGO_USERNAME,
    process.env.mongo_username,
  );
  const password = firstNonEmpty(
    process.env.MONGO_PASSWORD,
    process.env.mongo_password,
    process.env.password,
  );
  const cluster = firstNonEmpty(
    process.env.MONGO_CLUSTER,
    process.env.mongo_cluster,
    process.env.cluster,
  );
  const database = firstNonEmpty(
    process.env.MONGO_DATABASE,
    process.env.mongo_database,
    process.env.MONGO_DB,
    process.env.database,
  );

  if (username && password && cluster && database) {
    assertAtlasClusterHost(cluster);
    const user = encodeURIComponent(username);
    const pass = encodeURIComponent(password);
    return `mongodb+srv://${user}:${pass}@${cluster}.dzfap.mongodb.net/${database}?retryWrites=true&w=majority`;
  }

  throw new Error('Failed to resolve MongoDB URI');
}

function resolveJwtSecret(): string {
  const secret = firstNonEmpty(process.env.JWT_SECRET);
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  if (nodeEnv === 'production') {
    if (secret === undefined || secret.length < 32) {
      throw new Error(
        'JWT_SECRET must be set to a strong secret (32+ characters) in production',
      );
    }
    return secret;
  }
  return secret ?? 'development-only-jwt-secret-do-not-use-in-prod';
}

function resolveJwtExpiresIn(): string {
  return firstNonEmpty(process.env.JWT_EXPIRES_IN) ?? '7d';
}

function parseBcryptCost(value: string | undefined, defaultCost: number): number {
  if (value === undefined || value === '') {
    return defaultCost;
  }
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n) || n < 4 || n > 20) {
    throw new Error(`Invalid BCRYPT_COST: ${value}`);
  }
  return n;
}

export const env = {
  port: parsePort(process.env.PORT, 3000),
  mongodbUri: resolveMongoUri(),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: resolveJwtExpiresIn(),
  bcryptCost: parseBcryptCost(process.env.BCRYPT_COST, 12),
} as const;
