import { Request, Response, NextFunction } from "express";

/**
 * Small request logger that measures duration and prints status codes.
 */
export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    console.log(
      `[BFF][req] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(
        2
      )} ms)`
    );
  });

  next();
}
