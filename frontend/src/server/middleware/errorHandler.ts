import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const statusCode = error.statusCode ?? 500;

  request.log.error(
    {
      err: error,
      statusCode,
      url: request.url
    },
    'Unhandled error'
  );

  reply.status(statusCode).send({
    statusCode,
    error: statusCode >= 500 ? 'Internal Server Error' : error.message,
    message: error.message,
    path: request.url,
    timestamp: new Date().toISOString()
  });
}
