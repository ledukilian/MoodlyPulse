import type { FastifyReply, FastifyRequest } from 'fastify';

const REQUEST_START = Symbol('requestStart');

/**
 * Logs basic request information when the request is received.
 */
export async function logOnRequest(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  (request as any)[REQUEST_START] = Date.now();
  request.log.info(
    {
      method: request.method,
      url: request.url,
      id: request.id
    },
    'Incoming request'
  );
}

/**
 * Logs completion details, including the duration in ms.
 */
export async function logOnResponse(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const startedAt: number | undefined = (request as any)[REQUEST_START];
  const durationMs = typeof startedAt === 'number' ? Date.now() - startedAt : undefined;

  request.log.info(
    {
      method: request.method,
      url: request.url,
      id: request.id,
      status: reply.statusCode,
      durationMs
    },
    'Request completed'
  );
}
