import { randomBytes, timingSafeEqual } from "crypto";
import { Request, Response, NextFunction } from "express";

export const CSRF_COOKIE_NAME = "XSRF-TOKEN";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Basic CSRF verification for demo purposes.
 * Compares the token stored in the cookie with the one provided in the header or body.
 */
export function verifyCsrfToken(req: Request, res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.get("X-CSRF-Token");
  const bodyToken = req.body?.csrfToken;
  const providedToken = headerToken ?? bodyToken;

  if (!cookieToken || !providedToken || !safeCompare(cookieToken, providedToken)) {
    console.warn("[BFF][csrf] token mismatch or missing", {
      path: req.originalUrl,
      method: req.method
    });

    res.status(403).json({ error: "CSRF token missing or invalid" });
    return;
  }

  next();
}

/**
 * Exported for testing and reuse in routes when needed.
 */
export function safeCompare(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
