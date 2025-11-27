import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getCookie, setCookie } from 'hono/cookie';
import type { AppContext, AppEnv } from '../types';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';

export const generateCsrfToken = (): string => randomBytes(32).toString('hex');

export const persistCsrfToken = (c: AppContext, token: string) => {
  setCookie(c, CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });
  c.set('csrfToken', token);
};

const readRequestToken = async (c: AppContext): Promise<string | undefined> => {
  const headerToken = c.req.header('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  try {
    const body = await c.req.json<{ csrfToken?: string }>();
    return body?.csrfToken;
  } catch {
    return undefined;
  }
};

const safeCompare = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
};

export const verifyCsrfToken = async (c: AppContext): Promise<string> => {
  const cookieToken = getCookie(c, CSRF_COOKIE_NAME);
  const requestToken = await readRequestToken(c);

  if (!cookieToken || !requestToken || !safeCompare(cookieToken, requestToken)) {
    console.warn('[CSRF] Invalid token for request', c.req.path);
    throw new HTTPException(403, { message: 'Invalid CSRF token' });
  }

  c.set('csrfToken', requestToken);
  return requestToken;
};

export const csrfMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  await verifyCsrfToken(c);
  await next();
};
