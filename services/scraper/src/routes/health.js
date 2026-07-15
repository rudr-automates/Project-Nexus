'use strict';

const express = require('express');
const puppeteer = require('puppeteer-core');
const config = require('../config');

const router = express.Router();
const startedAt = Date.now();

router.get('/health', async (req, res) => {
  let browserless = 'unknown';

  try {
    const wsEndpoint = `${config.browserlessWsEndpoint}?token=${encodeURIComponent(config.browserlessToken)}`;
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    await browser.close().catch(() => {});
    browserless = 'reachable';
  } catch (err) {
    browserless = 'unreachable';
  }

  // The service itself is always "ok" if it can respond at all — Browserless
  // reachability is reported as a dependency status, not a hard failure,
  // so container orchestration doesn't restart-loop this service just
  // because Browserless is briefly busy or restarting.
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    dependencies: {
      browserless,
    },
  });
});

module.exports = router;
