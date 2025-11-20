import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpressError = Error & { status?: number; statusCode?: number; details?: any };

export function errorHandler(
  err: ExpressError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err.status ?? err.statusCode ?? 500;

  console.error("[BFF][error]", err.message, err.stack);

  res.status(statusCode).json({
    error: "Internal Server Error",
    details: err.details ?? err.message
  });
}
