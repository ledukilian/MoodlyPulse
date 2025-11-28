# MoodlyPulse Go BFF

This folder hosts the Go port of the previous Express-based Back-end for Front-end (BFF). It mirrors the same HTTP interface while leveraging Go's concurrency-friendly runtime and Gin for routing/middleware.

## Features

- `/health` – health probe describing the running tech stack.
- `/api/demo/proxy` – proxies `GET` requests to the Go backend's `/private/demo` endpoint and forwards the `Authorization` header.
- `/csrf/token` – generates a CSRF token, returns it in JSON, and persists it inside the `XSRF-TOKEN` cookie.
- `POST /demo/csrf` – validates CSRF tokens via middleware before returning a success payload.
- `/demo/error` – intentionally returns an error to exercise the global error handler.

## Prerequisites

- Go 1.21+
- Access to the upstream Go backend exposed via `BACKEND_GO_URL`

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `BACKEND_GO_URL` | Base URL for the upstream Go backend (required). | _none_ |
| `BFF_PORT` | Port for this BFF to listen on. | `4000` |
| `BFF_CORS_ORIGIN` | Allowed `Origin` for the browser client. | `http://localhost:4200` |
| `CSRF_SECRET` | Reserved for future HMAC-based CSRF tokens. | empty |
| `NODE_ENV` | Controls production safeguards (cookie security, Gin mode). | `development` |

## Install dependencies

```bash
cd /workspace/bff
go mod tidy
```

The tidy command downloads `gin`, `gin-contrib/cors`, and their transitive dependencies while writing `go.sum`.

## Run the server

```bash
cd /workspace/bff
BACKEND_GO_URL=http://localhost:8080 BFF_PORT=4000 go run ./cmd/server
```

The server logs `[BFF] Go server listening on http://localhost:4000`. Use Ctrl+C to trigger the graceful shutdown path.

### Build a binary

```bash
cd /workspace/bff
go build -o bin/bff ./cmd/server
```

Deploy the resulting binary with the same environment variables as above.

## Test plan for parity

1. `curl http://localhost:4000/health` – expect `tech:"go"` and HTTP 200.
2. `curl -H "Authorization: Bearer token" http://localhost:4000/api/demo/proxy` – ensure the backend receives the forwarded header and the response body matches the Express behavior.
3. `curl -c cookies.txt http://localhost:4000/csrf/token` – confirm both JSON and cookie are issued.
4. `curl -b cookies.txt -H "X-CSRF-Token: <token>" -X POST http://localhost:4000/demo/csrf` – expect `{ "message": "CSRF OK" }`.
5. `curl http://localhost:4000/demo/error -i` – expect HTTP 500 JSON identical to the Express error handler.

For automated regression checks you can also run `go test ./...` (place tests under `internal/...` as needed).

## Deployment notes

- **Development:** keep `NODE_ENV=development` so cookies stay `secure=false` and Gin logs debug info.
- **Production:** set `NODE_ENV=production`, terminate TLS in front of the BFF, and update `BFF_CORS_ORIGIN` to the deployed frontend URL.
- Containerization simply needs to copy `/bff`, run `go build`, and expose `BFF_PORT`.
