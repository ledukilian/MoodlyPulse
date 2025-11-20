import type { Context, Env } from 'hono';

export type Variables = {
  requestId: string;
  demoFlag?: boolean;
  csrfToken?: string;
};

export type AppEnv = Env & {
  Variables: Variables;
  Bindings: Record<string, never>;
};

export type AppContext = Context<AppEnv>;
