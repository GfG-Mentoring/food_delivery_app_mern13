import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/app.js';

describe('GET /restaurants', () => {
  it('returns 400 when latitude and longitude query params are omitted', async () => {
    const app = createApp();
    const res = await request(app).get('/restaurants').expect(400);

    expect(res.body).toEqual({
      error: 'lat and lng query parameters are required',
    });
  });
});

describe('GET /restaurants/:id', () => {
  it('returns 404 when identifier is not a 24-character hex MongoDB ObjectId', async () => {
    const app = createApp();
    const res = await request(app).get('/restaurants/not-an-object-id').expect(404);

    expect(res.body).toEqual({
      error: 'Restaurant not found',
    });
  });
});
