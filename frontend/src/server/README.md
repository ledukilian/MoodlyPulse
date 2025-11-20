# NestJS BFF POC

This folder hosts a lightweight NestJS “Backend for Frontend” used as a teaching aid.  
It lives entirely under `src/server` so Angular’s application code remains untouched.

## Installation

```bash
cd frontend
npm install
```

The command above installs Angular dependencies plus the extra NestJS packages defined in `package.json`.

## Running the BFF

```bash
# inside frontend/
BACKEND_GO_URL=http://localhost:8080 npm run bff:nest
```

Optional variables:

- `BFF_PORT`: port for the Nest app (defaults to `4000`).
- `CSRF_SECRET`: placeholder for future signing logic (not required for the demo).

`npm run dev:bff:nest` is an alias for the same script.

## Available Routes

- `GET /health` – simple heartbeat returning status + timestamp.
- `GET /api/demo/proxy` – calls `${BACKEND_GO_URL}/private/demo` via Axios, hiding the upstream URL from the browser.
- `GET /csrf/token` – issues a CSRF token, stores it in the `XSRF-TOKEN` HTTP-only cookie, and returns it in JSON for debugging.
- `POST /demo/csrf` – protected by `CsrfGuard`, validates header/body token against the cookie.
- `GET /demo/error` – intentionally throws to showcase the global error filter.

## Server Building Blocks

- `middleware/logger.middleware.ts` – logs method, path, status code, and response time for each request.
- `middleware/demo.middleware.ts` – lightweight middleware that tags the request and writes a trace message.
- `csrf/csrf.guard.ts` – compares cookie and header/body tokens to prevent forged requests.
- `filters/http-exception.filter.ts` – catches any uncaught exception, logs it, and emits a consistent JSON payload.
- `config.ts` – minimal environment loader with defaults and validation.
- `app.controller.ts` / `app.service.ts` – contain the routes and tiny business logic used by the demo.

Use this BFF as a reference when explaining how NestJS can sit between Angular and the Go backend while adding observability, middleware, and CSRF protections.
