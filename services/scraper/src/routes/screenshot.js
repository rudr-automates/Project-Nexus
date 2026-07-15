'use strict';

const express = require('express');
const { withPage } = require('../lib/browser');
const config = require('../config');

const router = express.Router();

router.post('/v1/screenshot', async (req, res, next) => {
  const { url, viewport, quality, maxDataUrlLength, navigationTimeoutMs } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url (string) is required' });
  }

  const width = viewport && Number.isFinite(viewport.width) ? viewport.width : 800;
  const height = viewport && Number.isFinite(viewport.height) ? viewport.height : 600;
  const jpegQuality = Number.isFinite(quality) ? quality : 40;
  const lengthCap = Number.isFinite(maxDataUrlLength)
    ? maxDataUrlLength
    : config.maxScreenshotDataUrlLength;

  const timeout = Math.min(
    Number.isFinite(navigationTimeoutMs) ? navigationTimeoutMs : 15000,
    config.maxNavigationTimeoutMs
  );

  try {
    const screenshotDataUrl = await withPage(
      async (page) => {
        await page.setViewport({ width, height });
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const buffer = await page.screenshot({ type: 'jpeg', quality: jpegQuality });
        const encoded = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        // Google Sheets cells cap out around 50,000 characters - drop
        // oversized shots rather than let a huge cell break the export.
        return encoded.length <= lengthCap ? encoded : '';
      },
      { navigationTimeoutMs: timeout }
    );

    res.status(200).json({ screenshotDataUrl });
  } catch (err) {
    // A single site failing to screenshot should never surface as a hard
    // workflow failure — mirror the original node's "fail soft" behavior.
    res.status(200).json({ screenshotDataUrl: '', error: err.message });
  }
});

module.exports = router;
