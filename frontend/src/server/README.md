# Express BFF (Proof of Concept)

This folder contains a minimal Back-end for Front-end (BFF) built with Express + TypeScript.

## Installation

```bash
cd frontend
npm install
```

## Run the BFF

```bash
npm run bff:express
```

Environment variables:

- `BFF_PORT` (default `4000`)
- `BACKEND_GO_URL` (required, e.g. `http://localhost:8080`)
- `CSRF_SECRET` (optional, reserved for future improvements)

## Available routes

- `GET /health` – quick healthcheck response.
- `GET /api/demo/proxy` – hides the Go backend by proxying requests to `/private/demo`.
- `GET /csrf/token` – issues a CSRF token (cookie + JSON payload).
- `POST /demo/csrf` – protected endpoint that validates the CSRF token.
- `GET /demo/error` – intentionally throws to demonstrate the global error handler.

## Middlewares

- `middleware/logger.ts` – logs every request with response status + duration.
- `middleware/demo.ts` – sample middleware that enriches the request.
- `middleware/csrf.ts` – generates and validates CSRF tokens.
- `middleware/errorHandler.ts` – catches every error and responds with a JSON payload.
