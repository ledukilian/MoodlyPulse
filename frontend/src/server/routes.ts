import { Router, Request, Response, NextFunction } from "express";

import { getConfig } from "./config";
import { verifyCsrfToken, CSRF_COOKIE_NAME, generateCsrfToken } from "./middleware/csrf";

const config = getConfig();

export function createRouter(): Router {
  const router = Router();

  router.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      tech: "express",
      timestamp: new Date().toISOString()
    });
  });

  router.get("/api/demo/proxy", async (req: Request, res: Response, next: NextFunction) => {
    const upstreamUrl = `${config.backendUrl}/private/demo`;

    try {
      const backendResponse = await fetch(upstreamUrl, {
        method: "GET",
        headers: buildProxyHeaders(req)
      });

      const bodyBuffer = Buffer.from(await backendResponse.arrayBuffer());
      const contentType = backendResponse.headers.get("content-type") ?? "application/octet-stream";

      if (!backendResponse.ok) {
        console.error(
          `[BFF][proxy] Upstream error ${backendResponse.status}: ${bodyBuffer.toString()}`
        );
        res.status(backendResponse.status).json({
          error: "Upstream service error",
          status: backendResponse.status
        });
        return;
      }

      res.status(backendResponse.status);
      res.set("content-type", contentType);
      res.send(bodyBuffer);
    } catch (error) {
      console.error("[BFF][proxy] Failed to reach Go backend", error);
      next(error);
    }
  });

  router.get("/csrf/token", (_req: Request, res: Response) => {
    const token = generateCsrfToken();

    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction(),
      maxAge: 60 * 60 * 1000 // 1 hour for the demo
    });

    res.json({ csrfToken: token });
  });

  router.post("/demo/csrf", verifyCsrfToken, (_req: Request, res: Response) => {
    res.json({
      message: "CSRF OK",
      receivedAt: new Date().toISOString()
    });
  });

  router.get("/demo/error", (_req: Request, _res: Response, next: NextFunction) => {
    next(new Error("demo error"));
  });

  return router;
}

function buildProxyHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};

  const authHeader = req.header("authorization");
  if (authHeader) {
    headers.authorization = authHeader;
  }

  return headers;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
