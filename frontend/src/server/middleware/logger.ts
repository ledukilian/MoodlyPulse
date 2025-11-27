import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../types';

// Logs each request with method, path, status, and duration.
export const loggerMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const started = Date.now();
  await next();
  const duration = Date.now() - started;
  const requestId = c.get('requestId');
  const prefix = requestId ? `[${requestId}] ` : '';

  console.log(
    `${prefix}${c.req.method} ${c.req.path} -> ${c.res.status} (${duration}ms)`
  );
};
