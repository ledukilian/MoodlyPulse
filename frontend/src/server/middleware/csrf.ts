import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import '@fastify/cookie';

const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'x-csrf-token';

export function generateCsrfToken(_secret?: string): string {
  // A random token is sufficient for this demo POC.
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCsrfToken(request: FastifyRequest): void {
  const cookieToken = request.cookies?.[CSRF_COOKIE];
  const headerValue = request.headers[CSRF_HEADER];
  const headerToken = typeof headerValue === 'string' ? headerValue : undefined;
  const bodyToken =
    typeof (request.body as Record<string, unknown> | undefined)?.['csrfToken'] === 'string'
      ? ((request.body as Record<string, string>).csrfToken as string)
      : undefined;

  const providedToken = headerToken ?? bodyToken;

  if (!cookieToken || !providedToken) {
    const error = new Error('Invalid CSRF token');
    (error as any).statusCode = 403;
    throw error;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const providedBuffer = Buffer.from(providedToken);

  if (
    cookieBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(cookieBuffer, providedBuffer)
  ) {
    const error = new Error('Invalid CSRF token');
    (error as any).statusCode = 403;
    throw error;
  }
}

export async function csrfPreHandler(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  verifyCsrfToken(request);
}

export const csrfCookieName = CSRF_COOKIE;
export const csrfHeaderName = CSRF_HEADER;
