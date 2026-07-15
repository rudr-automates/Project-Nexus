'use strict';

/**
 * Central, environment-driven configuration for nexus-scraper.
 *
 * Per Project Nexus INFRASTRUCTURE_STANDARDS.md: no hardcoded secrets, every
 * configurable value comes from the environment, and this is the ONLY file
 * in the service that should read `process.env` directly.
 */

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  port: parseInt(requireEnv('PORT', '4000'), 10),

  // Browserless connection. BROWSERLESS_WS_ENDPOINT points at the existing
  // `browserless` container over the shared nexus-network — this service
  // never launches its own Chromium.
  browserlessWsEndpoint: requireEnv('BROWSERLESS_WS_ENDPOINT', 'ws://browserless:3000'),
  browserlessToken: requireEnv('BROWSERLESS_TOKEN'),

  // Default timeouts. Individual requests may override these within caps.
  defaultNavigationTimeoutMs: parseInt(requireEnv('SCRAPER_NAV_TIMEOUT_MS', '30000'), 10),
  maxNavigationTimeoutMs: parseInt(requireEnv('SCRAPER_MAX_NAV_TIMEOUT_MS', '90000'), 10),

  // Google Sheets cells cap out around 50,000 characters — keep a safety
  // margin by default so a screenshot never breaks the downstream export.
  maxScreenshotDataUrlLength: parseInt(requireEnv('SCRAPER_MAX_SCREENSHOT_DATA_URL_LENGTH', '45000'), 10),

  logLevel: requireEnv('LOG_LEVEL', 'info'),
};

module.exports = config;
