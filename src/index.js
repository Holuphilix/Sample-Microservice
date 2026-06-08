const express = require('express');
const promClient = require('prom-client');
const { version } = require('../package.json');

const app = express();

// Prometheus client and registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Middleware to count requests with method, route and status
app.use((req, res, next) => {
  const originalEnd = res.end;
  res.end = function chunkedEnd(...args) {
    try {
      const route = (req.route && req.route.path) || req.path || 'unknown';
      httpRequests.labels(req.method, route, String(res.statusCode)).inc();
    } catch (e) {
      // don't let metrics collection break responses
    }
    res.end = originalEnd;
    return res.end.apply(this, args);
  };
  next();
});

app.get('/', (req, res) => {
  res.json({
    application: 'sample-microservice',
    version: version || '1.0.0',
    status: 'running',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).send('Could not collect metrics');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`sample-microservice listening on port ${port}`);
});

module.exports = app;
