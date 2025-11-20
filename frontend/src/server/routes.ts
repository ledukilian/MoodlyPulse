import type { Hono } from 'hono';
import { getConfig } from './config';
import type { AppEnv } from './types';
import { csrfMiddleware, generateCsrfToken, persistCsrfToken } from './middleware/csrf';

export const registerRoutes = (app: Hono<AppEnv>) => {
  const config = getConfig();

  // Simple healthcheck to verify the BFF is running.
  app.get('/health', (c) =>
    c.json({
      status: 'ok',
      tech: 'hono',
      timestamp: new Date().toISOString(),
    }),
  );

  // Proxy demo that hides the underlying Go backend URL.
  app.get('/api/demo/proxy', async (c) => {
    const targetUrl = `${config.backendGoUrl}/private/demo`;
    const headers: Record<string, string> = {};
    const authHeader = c.req.header('authorization');
    if (authHeader) {
      headers['authorization'] = authHeader;
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    const contentType = upstreamResponse.headers.get('content-type') ?? '';
    let data: unknown;

    if (contentType.includes('application/json')) {
      data = await upstreamResponse.json();
    } else {
      data = await upstreamResponse.text();
    }

    c.status(upstreamResponse.ok ? 200 : 502);
    return c.json({
      proxied: true,
      upstreamStatus: upstreamResponse.status,
      data,
    });
  });

  // Issues a CSRF token, stores it in an httpOnly cookie, and echoes it back for demo purposes.
  app.get('/csrf/token', (c) => {
    const token = generateCsrfToken();
    persistCsrfToken(c, token);
    return c.json({ csrfToken: token });
  });

  // Example endpoint that requires a valid CSRF token in header or body.
  app.post('/demo/csrf', csrfMiddleware, (c) =>
    c.json({
      message: 'CSRF OK',
      receivedAt: new Date().toISOString(),
      requestId: c.get('requestId'),
      csrfToken: c.get('csrfToken'),
    }),
  );

  // Route that throws intentionally so we can observe the global error handler output.
  app.get('/demo/error', () => {
    throw new Error('Demo error triggered intentionally.');
  });
};
