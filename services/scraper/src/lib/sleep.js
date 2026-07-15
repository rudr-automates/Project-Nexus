'use strict';

/**
 * Promise-based delay. Modern Puppeteer removed `page.waitForTimeout`, so
 * every route in this service uses this helper instead.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { sleep };
