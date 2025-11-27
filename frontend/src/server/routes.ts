import type { FastifyInstance } from 'fastify';
import '@fastify/cookie';
import { type ServerConfig } from './config';
import {
  csrfCookieName,
  csrfHeaderName,
  csrfPreHandler,
  generateCsrfToken
} from './middleware/csrf';

interface DemoCsrfBody {
  csrfToken?: string;
}

export function registerRoutes(app: FastifyInstance, config: ServerConfig): void {
  app.get('/health', async () => ({
    status: 'ok',
    tech: 'fastify',
    timestamp: new Date().toISOString()
  }));

  app.get('/api/demo/proxy', async (request, reply) => {
    const targetUrl = new URL('/private/demo', config.backendUrl).toString();
    const headers: Record<string, string> = {};
    const authHeader = request.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.length > 0) {
      headers['authorization'] = authHeader;
    }

    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers
    });

    const rawBody = await backendResponse.text();

    if (!backendResponse.ok) {
      const error = new Error(`Proxy request failed with status ${backendResponse.status}`);
      (error as any).statusCode = 502;
      (error as any).details = rawBody;
      throw error;
    }

    const contentType = backendResponse.headers.get('content-type') ?? 'application/json';
    reply.type(contentType);

    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  app.get('/csrf/token', async (_request, reply) => {
    const csrfToken = generateCsrfToken(config.csrfSecret);

    reply.setCookie(csrfCookieName, csrfToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction
    });

    return {
      cookie: csrfCookieName,
      header: csrfHeaderName
    };
  });

  app.post<{ Body: DemoCsrfBody }>('/demo/csrf', { preHandler: csrfPreHandler }, async (request) => ({
    message: 'CSRF OK',
    receivedAt: new Date().toISOString(),
    demoFlag: (request as any).demoFlag === true
  }));

  app.get('/demo/error', async () => {
    const error = new Error('demo error');
    error.name = 'DemoRouteError';
    throw error;
  });
}
