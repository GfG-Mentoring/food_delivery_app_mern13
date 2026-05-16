import mongoose from 'mongoose';

const connectTimeoutMs = 5_000;

export async function connectDb(uri: string): Promise<void> {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: connectTimeoutMs,
    connectTimeoutMS: connectTimeoutMs,
  });
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
