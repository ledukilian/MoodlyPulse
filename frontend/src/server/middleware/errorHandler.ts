import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types';

export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  const statusFromError =
    err instanceof HTTPException
      ? err.status
      : typeof (err as { status?: number }).status === 'number'
        ? (err as { status?: number }).status!
        : typeof (err as { statusCode?: number }).statusCode === 'number'
          ? (err as { statusCode?: number }).statusCode!
          : 500;

  const message = err instanceof HTTPException ? err.message : 'Internal Server Error';

  console.error('[BFF] Unhandled error', {
    message: err.message,
    path: c.req.path,
    requestId: c.get('requestId'),
    stack: err.stack,
  });

  return c.json(
    {
      statusCode: statusFromError,
      error: message,
      path: c.req.path,
      requestId: c.get('requestId'),
      timestamp: new Date().toISOString(),
    },
    statusFromError,
  );
};
