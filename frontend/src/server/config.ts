export interface ServerConfig {
  port: number;
  backendGoUrl: string;
  csrfSecret?: string;
}

/**
 * Reads environment variables used by the BFF.
 * Throws if the Go backend URL is not provided to avoid proxy misconfiguration.
 */
export function getConfig(): ServerConfig {
  const port = Number(process.env.BFF_PORT ?? 4000);
  const backendGoUrl = process.env.BACKEND_GO_URL;

  if (!backendGoUrl) {
    throw new Error('BACKEND_GO_URL env var is required for the proxy route.');
  }

  return {
    port: Number.isNaN(port) ? 4000 : port,
    backendGoUrl,
    csrfSecret: process.env.CSRF_SECRET,
  };
}
