import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Demo middleware that tags requests to show the middleware pipeline in action.
 */
@Injectable()
export class DemoMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    (req as Request & { demoFlag?: boolean }).demoFlag = true;
    console.log(`[DemoMiddleware] ${req.method} ${req.originalUrl}`);
    next();
  }
}
