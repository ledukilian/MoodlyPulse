export interface ServerConfig {
  port: number;
  backendUrl: string;
  csrfSecret?: string;
}

/**
 * Reads environment variables relevant to the BFF server and
 * applies defaults plus basic validation.
 */
export function getConfig(): ServerConfig {
  const rawPort = process.env.BFF_PORT ?? '4000';
  const parsedPort = Number.parseInt(rawPort, 10);
  const backendUrl = process.env.BACKEND_GO_URL;

  if (!backendUrl) {
    throw new Error('BACKEND_GO_URL is required to start the Fastify BFF');
  }

  return {
    port: Number.isFinite(parsedPort) ? parsedPort : 4000,
    backendUrl,
    csrfSecret: process.env.CSRF_SECRET
  };
}
