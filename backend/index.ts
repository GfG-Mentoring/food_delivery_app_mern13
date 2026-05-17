/// <reference path="./src/types/express.d.ts" />

import 'dotenv/config';

import { createApp } from './src/app.js';

/** Vercel Express entry (`export default`); see https://vercel.com/docs/frameworks/backend/express */
const app = createApp();

export default app;
