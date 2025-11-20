# Hono BFF (Proof of Concept)

This folder contains a tiny Backend-for-Frontend (BFF) built with [Hono](https://hono.dev/) and TypeScript. It lives alongside the Angular app to demonstrate how a lightweight Node.js layer can sit in front of the Go backend.

## Installation

```bash
cd frontend
npm install
```

This installs the Angular dependencies plus the few packages required for the Hono server.

## Running the BFF

```bash
BACKEND_GO_URL=http://localhost:8080 BFF_PORT=4000 npm run bff:hono
```

Environment variables:
- `BACKEND_GO_URL` (required): base URL of the Go API (e.g. `http://localhost:8080`).
- `BFF_PORT` (optional): listening port for the BFF (defaults to `4000`).
- `CSRF_SECRET` (optional): hook for signing CSRF tokens if you want to enhance the demo.

## Available routes

- `GET /health` – simple healthcheck returning uptime information.
- `GET /api/demo/proxy` – proxies a request to the hidden Go backend endpoint and returns the response payload.
- `GET /csrf/token` – generates a CSRF token, stores it in an HTTP-only cookie, and echoes it back for debugging.
- `POST /demo/csrf` – requires the CSRF token (header `X-CSRF-Token` or JSON body `csrfToken`).
- `GET /demo/error` – intentionally throws to showcase the global error handler output.

## Middlewares & handlers

- `middleware/logger.ts` – logs method, path, status, and duration for every request.
- `middleware/demo.ts` – demo middleware that adds a per-request UUID and flag to the Hono context.
- `middleware/csrf.ts` – token generation, cookie storage, and verification helpers/middleware.
- `middleware/errorHandler.ts` – centralized `app.onError` handler producing consistent JSON errors.

Routes are defined in `routes.ts` and registered in `index.ts`, which also wires up CORS, cookies, and launches the Node server via `@hono/node-server`.
