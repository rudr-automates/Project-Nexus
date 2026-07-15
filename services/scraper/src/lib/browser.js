'use strict';

const puppeteer = require('puppeteer-core');
const config = require('../config');

/**
 * Shared connection helper. Every route module (googleMaps, screenshot, and
 * any future capability added to this service) goes through this single
 * function instead of talking to Browserless directly. That keeps the
 * "how do we get a browser" concern in exactly one place, so future routes
 * inherit consistent timeouts, auth, and cleanup behavior for free.
 *
 * `fn` receives a connected `Browser` instance and must return a plain,
 * JSON-serializable value. The browser connection is always cleaned up,
 * even if `fn` throws.
 */
async function withBrowser(fn) {
  const wsEndpoint = `${config.browserlessWsEndpoint}?token=${encodeURIComponent(config.browserlessToken)}`;

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsEndpoint,
    defaultViewport: null,
  });

  try {
    return await fn(browser);
  } finally {
    // `browser.close()` (rather than `disconnect()`) tells Browserless the
    // session is done so it releases the slot back to its concurrency pool
    // (BROWSERLESS_CONCURRENT in the platform .env).
    await browser.close().catch(() => {
      /* best-effort cleanup only */
    });
  }
}

/**
 * Convenience wrapper for the common case of "one page per request".
 */
async function withPage(fn, { navigationTimeoutMs } = {}) {
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    const timeout = navigationTimeoutMs || config.defaultNavigationTimeoutMs;
    page.setDefaultNavigationTimeout(timeout);
    page.setDefaultTimeout(timeout);
    try {
      return await fn(page);
    } finally {
      await page.close().catch(() => {});
    }
  });
}

module.exports = { withBrowser, withPage };
