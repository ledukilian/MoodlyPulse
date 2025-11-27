import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsrfGuard } from './csrf/csrf.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DemoMiddleware } from './middleware/demo.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CsrfGuard, DemoMiddleware, LoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, DemoMiddleware).forRoutes('*');
  }
}
