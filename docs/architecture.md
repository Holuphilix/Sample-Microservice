# Architecture

## Service Responsibilities

Sample Microservice is a stateless Node.js and Express application designed for containerized runtime environments. It provides a compact API surface for application identity, health validation, and Prometheus-compatible metrics.

The service is responsible for:

- Serving application metadata from `GET /`.
- Reporting service health from `GET /health`.
- Exposing runtime and request metrics from `GET /metrics`.
- Listening on `0.0.0.0` for container and Kubernetes compatibility.

## Runtime Flow

1. The container starts `node src/index.js`.
2. Express initializes route handlers and metrics middleware.
3. `prom-client` registers default Node.js metrics and a custom HTTP request counter.
4. Incoming requests are served by Express and counted with method, route, and status labels.
5. Observability systems can scrape `/metrics`; orchestration systems can probe `/health`.

## Operational Characteristics

- Stateless runtime with no local persistence.
- Configurable port through the `PORT` environment variable.
- Health endpoint suitable for liveness and readiness probes.
- Metrics endpoint suitable for Prometheus-compatible scraping.
- Container image designed for CI validation and Kubernetes deployment readiness.

## Deployment Topology

The application can run locally with Node.js, in Docker, or as a Kubernetes Deployment. A typical production topology includes:

- One or more application pods running the container image.
- A Kubernetes Service routing traffic to pod port `3000`.
- Liveness and readiness probes using `/health`.
- Prometheus or a compatible collector scraping `/metrics`.
- CI-generated image tags based on the Git commit SHA for traceability.
