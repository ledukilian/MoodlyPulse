import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      demoFlag?: boolean;
    }
  }
}

/**
 * Demonstration middleware that tags requests with a flag.
 */
export function demoMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.demoFlag = true;
  console.debug(`[BFF][demo] middleware executed for ${req.method} ${req.originalUrl}`);
  next();
}
