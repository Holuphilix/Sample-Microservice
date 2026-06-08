Source code for the microservice
--------------------------------

This directory will contain the Node.js + Express application source.

Planned layout:
- `src/index.js` — application entrypoint (starts Express server)
- `src/app.js` — Express app and route registration
- `src/routes/` — route handlers
- `src/middleware/` — middleware (logging, metrics, error handling)

Endpoints to implement:
- `GET /` — API landing
- `GET /health` — healthcheck
- `GET /metrics` — Prometheus metrics endpoint
