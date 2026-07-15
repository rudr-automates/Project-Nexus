'use strict';

const express = require('express');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(express.json({ limit: '2mb' }));

// Minimal structured request logging — dependency-free on purpose, so this
// service stays lean. Swap for the platform's shared monitoring stack
// (per PROJECT_BIBLE.md's future "Monitoring" capability) without touching
// route logic.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const entry = {
      time: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
    };
    console.log(JSON.stringify(entry));
  });
  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// Centralized error handler — every route's `next(err)` lands here so
// error-response shape stays consistent across the whole service.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(JSON.stringify({ time: new Date().toISOString(), error: err.message, stack: err.stack }));
  res.status(500).json({ error: err.message || 'Internal scraper error' });
});

app.listen(config.port, () => {
  console.log(`nexus-scraper listening on port ${config.port}`);
});
