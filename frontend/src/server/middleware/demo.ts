import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Simple hook used to demonstrate how a custom preHandler works.
 * It flags the request and logs a short message with method + URL.
 */
export async function demoHook(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  (request as any).demoFlag = true;
  request.log.debug(
    {
      method: request.method,
      url: request.url
    },
    'Demo hook executed'
  );
}
