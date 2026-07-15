/**
 * ============================================================================
 * Project Nexus
 * Browser Runtime
 * ============================================================================
 *
 * Central Browser Runtime used by every Project Nexus application.
 *
 * Current Backend
 * ----------------
 * Browserless + Chromium
 *
 * Future
 * ----------------
 * Browserless + Playwright
 * Browser Pooling
 * Session Management
 * Persistent Contexts
 * AI Browser Agents
 * ============================================================================
 */

const puppeteer = require("puppeteer-core");

const config = require("./browser-config");

async function connectBrowser() {

    const endpoint =
        `${config.browserless.endpoint}` +
        `?token=${config.browserless.token}`;

    let lastError;

    for (
        let attempt = 1;
        attempt <= config.browserless.reconnectAttempts;
        attempt++
    ) {

        try {

            const browser = await puppeteer.connect({

                browserURL: undefined,

                browserWSEndpoint: endpoint,

                protocolTimeout: config.browserless.timeout

            });

            return browser;

        } catch (err) {

            lastError = err;

            console.log(
                `Browser connection failed (${attempt}/${config.browserless.reconnectAttempts})`
            );

            await new Promise(resolve =>
                setTimeout(resolve, config.browserless.reconnectDelay)
            );
        }
    }

    throw lastError;
}

async function createPage(browser) {

    const page = await browser.newPage();

    await page.setViewport(config.browser.viewport);

    await page.setUserAgent(config.browser.userAgent);

    return page;
}

module.exports = {

    connectBrowser,

    createPage

};