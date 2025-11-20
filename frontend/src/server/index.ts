import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { getConfig } from './config';
import { registerRoutes } from './routes';
import { logOnRequest, logOnResponse } from './middleware/logger';
import { demoHook } from './middleware/demo';
import { errorHandler } from './middleware/errorHandler';

async function bootstrap(): Promise<void> {
  const config = getConfig();
  const app = fastify({ logger: true });

  await app.register(cookie);
  await app.register(cors, {
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST']
  });

  app.addHook('onRequest', logOnRequest);
  app.addHook('onResponse', logOnResponse);
  app.addHook('preHandler', demoHook);
  app.setErrorHandler(errorHandler);

  registerRoutes(app, config);

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Fastify BFF listening on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
