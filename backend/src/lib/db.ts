import mongoose from 'mongoose';

const connectTimeoutMs = 5_000;

export async function connectDb(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: connectTimeoutMs,
    connectTimeoutMS: connectTimeoutMs,
  });
}

let connectOnce: Promise<void> | undefined;

/**
 * Idempotent connect for serverless (Vercel): first request waits; later calls no-op.
 * Local `server.ts` still calls `connectDb` before listen.
 */
export function ensureDbConnected(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }
  connectOnce ??= connectDb(uri);
  return connectOnce;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
