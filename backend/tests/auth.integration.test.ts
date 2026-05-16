import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createApp } from '../src/app.js';
import { connectDb, disconnectDb } from '../src/lib/db.js';
import { User } from '../src/models/user.model.js';

describe('POST /auth/register', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDb(mongoServer.getUri());
  });

  afterAll(async () => {
    await disconnectDb();
    await mongoServer.stop();
  });

  it('creates a user and returns a token', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password12',
      })
      .expect(201);

    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toEqual({
      id: expect.any(String),
      email: 'test@example.com',
      name: 'Test User',
      createdAt: expect.any(String),
    });
  });

  it('returns 409 when email is already registered', async () => {
    const app = createApp();
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Other',
        email: 'dup@example.com',
        password: 'password12',
      })
      .expect(201);

    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Other Two',
        email: 'dup@example.com',
        password: 'password12',
      })
      .expect(409);

    expect(res.body).toEqual({ error: 'Email already registered' });
  });
});

describe('POST /auth/login', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDb(mongoServer.getUri());
    const app = createApp();
    await request(app).post('/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'secretpass',
    });
  });

  afterAll(async () => {
    await disconnectDb();
    await mongoServer.stop();
  });

  it('returns 200 with token on valid credentials', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'secretpass' })
      .expect(200);

    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe('login@example.com');
  });

  it('returns 401 for wrong password', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'wrong-password' })
      .expect(401);

    expect(res.body).toEqual({ error: 'Invalid email or password' });
  });

  it('returns 401 (not 500) when user document has no passwordHash', async () => {
    await User.collection.insertOne({
      email: 'legacy@example.com',
      name: 'Legacy',
    });

    const app = createApp();
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'legacy@example.com', password: 'anything123' })
      .expect(401);

    expect(res.body).toEqual({ error: 'Invalid email or password' });
  });
});

describe('GET /auth/me', () => {
  let mongoServer: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDb(mongoServer.getUri());
    const app = createApp();
    const reg = await request(app).post('/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'password12',
    });
    token = reg.body.token as string;
  });

  afterAll(async () => {
    await disconnectDb();
    await mongoServer.stop();
  });

  it('returns 401 without Authorization header', async () => {
    const app = createApp();
    const res = await request(app).get('/auth/me').expect(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('returns 200 with user when Bearer token is valid', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.user).toEqual({
      id: expect.any(String),
      email: 'me@example.com',
      name: 'Me User',
      createdAt: expect.any(String),
    });
  });
});
