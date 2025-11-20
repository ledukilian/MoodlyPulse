export type ServerConfig = {
  port: number;
  backendUrl: string;
  csrfSecret?: string;
  corsOrigin: string;
};

let cachedConfig: ServerConfig | null = null;

/**
 * Reads environment variables once and exposes typed configuration values.
 */
export function getConfig(): ServerConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const rawPort = Number(process.env.BFF_PORT ?? 4000);
  const port = Number.isFinite(rawPort) ? rawPort : 4000;

  const backendUrl = process.env.BACKEND_GO_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_GO_URL environment variable is required for the BFF.");
  }

  cachedConfig = {
    port,
    backendUrl: backendUrl.replace(/\/$/, ""),
    csrfSecret: process.env.CSRF_SECRET,
    corsOrigin: process.env.BFF_CORS_ORIGIN ?? "http://localhost:4200"
  };

  return cachedConfig;
}
