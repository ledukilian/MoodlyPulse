import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getConfig();

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(config.port);
  Logger.log(
    `Nest BFF listening on http://localhost:${config.port}`,
    'Bootstrap',
  );
}

bootstrap().catch((error) => {
  Logger.error('Failed to bootstrap Nest application', error);
  process.exit(1);
});
