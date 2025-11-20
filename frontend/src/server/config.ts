export type AppConfig = {
  port: number;
  backendGoUrl: string;
  csrfSecret?: string;
};

let cachedConfig: AppConfig | null = null;

export const getConfig = (): AppConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const portFromEnv = Number.parseInt(process.env.BFF_PORT ?? '4000', 10);
  const port = Number.isNaN(portFromEnv) ? 4000 : portFromEnv;
  const backendGoUrl = process.env.BACKEND_GO_URL;

  if (!backendGoUrl) {
    throw new Error('BACKEND_GO_URL environment variable is required to start the Hono BFF.');
  }

  cachedConfig = {
    port,
    backendGoUrl: backendGoUrl.replace(/\/$/, ''),
    csrfSecret: process.env.CSRF_SECRET,
  };

  return cachedConfig;
};
