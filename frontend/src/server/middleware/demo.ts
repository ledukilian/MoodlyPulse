import type { MiddlewareHandler } from 'hono';
import { randomUUID } from 'node:crypto';
import type { AppEnv } from '../types';

// Demonstrates how to enrich each request with custom context variables.
export const demoMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const requestId = randomUUID();
  c.set('requestId', requestId);
  c.set('demoFlag', true);

  console.log(`[DemoMiddleware] requestId=${requestId} ${c.req.method} ${c.req.path}`);
  await next();
};
