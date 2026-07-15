/**
 * ============================================================================
 * Project Nexus
 * Browser Runtime Configuration
 * ============================================================================
 *
 * Central configuration for every browser-based application running on
 * Project Nexus.
 *
 * Current Runtime:
 *   Browserless + Chromium
 *
 * Future Runtime:
 *   Browserless + Playwright
 *   Browser Pools
 *   Session Persistence
 *   Distributed Browser Workers
 * ============================================================================
 */

module.exports = {

    browserless: {

        endpoint:
            process.env.BROWSERLESS_ENDPOINT ||
            "ws://browserless:3000",

        token:
            process.env.BROWSERLESS_TOKEN ||
            "project-nexus-browserless",

        timeout:
            Number(process.env.BROWSER_TIMEOUT || 30000),

        reconnectAttempts:
            3,

        reconnectDelay:
            2000
    },

    browser: {

        headless: true,

        viewport: {

            width: 1366,
            height: 900
        },

        userAgent:

            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0 Safari/537.36"
    }
};