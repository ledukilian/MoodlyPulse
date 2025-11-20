import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { cookie } from 'hono/cookie';
import { loggerMiddleware } from './middleware/logger';
import { demoMiddleware } from './middleware/demo';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { getConfig } from './config';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

app.use('*', cors({
  origin: 'http://localhost:4200',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
}));

app.use('*', cookie());
app.use('*', loggerMiddleware);
app.use('*', demoMiddleware);

registerRoutes(app);
app.onError(errorHandler);

const config = getConfig();

serve({
  fetch: app.fetch,
  port: config.port,
});

console.log(
  `🚀 Hono BFF running on http://localhost:${config.port} (proxying to ${config.backendGoUrl})`,
);
