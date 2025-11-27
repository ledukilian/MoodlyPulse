# Fastify BFF (Proof of Concept)

This folder contains a lightweight Fastify + TypeScript Backends For Frontend (BFF) example. It lives alongside the Angular app but remains completely separate from `src/app`.

## Getting started

```bash
cd frontend
npm install          # already done if you ran install at the root earlier
npm run bff:fastify  # uses tsx + tsconfig.server.json
```

Set the following environment variables before starting:

| Variable        | Description                                      | Default  |
| --------------- | ------------------------------------------------ | -------- |
| `BFF_PORT`      | Port used by Fastify                             | `4000`   |
| `BACKEND_GO_URL`| Base URL of the real Go backend (required)       | _none_   |
| `CSRF_SECRET`   | Optional secret if you want to sign CSRF tokens  | _empty_  |

Example:

```bash
BFF_PORT=4000 BACKEND_GO_URL=http://localhost:8080 npm run bff:fastify
```

## Routes overview

- `GET /health` — simple health check with timestamp.
- `GET /api/demo/proxy` — hides `BACKEND_GO_URL` behind the BFF and proxies to `/private/demo`.
- `GET /csrf/token` — issues a CSRF token, stores it in the `XSRF-TOKEN` cookie, and returns it in JSON.
- `POST /demo/csrf` — protected endpoint that verifies the CSRF token provided via header or body.
- `GET /demo/error` — deliberately throws to showcase the global error handler.

## Middleware & hooks

- `middleware/logger.ts` — logs each request (onRequest/onResponse) with duration.
- `middleware/demo.ts` — simple preHandler hook that flags the request for demo purposes.
- `middleware/csrf.ts` — token generation + verification helper used by `/csrf/token` and `/demo/csrf`.
- `middleware/errorHandler.ts` — centralized JSON error responses for uncaught errors.

Everything is wired in `src/server/index.ts` where Fastify is bootstrapped, plugins are registered, and routes are attached. Use this setup as a template for experimenting with BFF patterns without touching the Angular code.
