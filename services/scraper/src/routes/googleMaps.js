'use strict';

const express = require('express');
const { withPage } = require('../lib/browser');
const { sleep } = require('../lib/sleep');
const config = require('../config');

const router = express.Router();

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const CONSENT_SELECTORS = [
  'button[aria-label="Accept all"]',
  'button[aria-label="I agree"]',
  'form[action*="consent"] button',
];

/**
 * Runs entirely inside this service. n8n never sees any of this logic —
 * it only sees the JSON contract at the bottom of this file. If Google
 * Maps' DOM changes, this is the one place to update, and every workflow
 * that calls this route benefits immediately without touching n8n at all.
 */
async function scrapeGoogleMaps(page, { searchUrl, maxResults, scrollWaitMs, maxScrollAttempts }) {
  await page.setUserAgent(USER_AGENT);
  await page.setViewport({ width: 1366, height: 900 });

  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  for (const sel of CONSENT_SELECTORS) {
    try {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await sleep(1000);
        break;
      }
    } catch (e) {
      // no consent dialog present, keep going
    }
  }

  await page.waitForSelector('div[role="feed"]', { timeout: 20000 }).catch(() => {});

  let previousCount = 0;
  let stableRounds = 0;

  for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
    const currentCount = await page.evaluate(
      () => document.querySelectorAll('a[href*="/maps/place/"]').length
    );

    if (currentCount >= maxResults) break;

    if (currentCount === previousCount) {
      stableRounds++;
      if (stableRounds >= 3) break; // no new businesses loading - stop, avoid infinite scroll
    } else {
      stableRounds = 0;
    }
    previousCount = currentCount;

    await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight;
    });

    await sleep(scrollWaitMs + Math.floor(Math.random() * 500));
  }

  const cardHandles = await page.$$('a[href*="/maps/place/"]');
  const seenHref = new Set();
  const uniqueHrefs = [];
  for (const handle of cardHandles) {
    const href = await page.evaluate((el) => el.href, handle);
    if (href && !seenHref.has(href)) {
      seenHref.add(href);
      uniqueHrefs.push(href);
    }
  }

  const targetHrefs = uniqueHrefs.slice(0, maxResults);
  const results = [];

  for (const href of targetHrefs) {
    try {
      await page.goto(href, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(800);

      const data = await page.evaluate(() => {
        const name = document.querySelector('h1')?.textContent?.trim() || '';

        const ratingEl =
          document.querySelector('div.F7nice span[aria-hidden="true"]') ||
          document.querySelector('span[aria-label*="stars"]');
        const ratingText = ratingEl
          ? ratingEl.textContent || ratingEl.getAttribute('aria-label') || ''
          : '';

        const reviewsCandidate = Array.from(document.querySelectorAll('span')).find((el) =>
          /\d[\d,]*\s+review/i.test(el.textContent || '')
        );
        const reviewsText = reviewsCandidate ? reviewsCandidate.textContent : '';

        const websiteEl =
          document.querySelector('a[data-item-id="authority"]') ||
          document.querySelector('a[aria-label^="Website:"]');
        const website = websiteEl ? websiteEl.href : '';

        const phoneEl =
          document.querySelector('button[data-item-id^="phone:tel:"]') ||
          document.querySelector('button[aria-label^="Phone:"]');
        const phone = phoneEl
          ? (phoneEl.getAttribute('aria-label') || '').replace(/^Phone:\s*/i, '')
          : '';

        const addressEl =
          document.querySelector('button[data-item-id="address"]') ||
          document.querySelector('button[aria-label^="Address:"]');
        const address = addressEl
          ? (addressEl.getAttribute('aria-label') || '').replace(/^Address:\s*/i, '')
          : '';

        const categoryEl = document.querySelector('button[jsaction*="category"]');
        const category = categoryEl ? categoryEl.textContent.trim() : '';

        return { name, ratingText, reviewsText, website, phone, address, category };
      });

      const urlMatch = href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const latitude = urlMatch ? parseFloat(urlMatch[1]) : null;
      const longitude = urlMatch ? parseFloat(urlMatch[2]) : null;

      const ratingMatch = (data.ratingText || '').match(/(\d+(\.\d+)?)/);
      const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

      const reviewMatch = (data.reviewsText || '').replace(/,/g, '').match(/(\d+)/);
      const reviewCount = reviewMatch ? parseInt(reviewMatch[1], 10) : 0;

      if (data.name) {
        results.push({
          businessName: data.name,
          website: data.website,
          googleMapsUrl: href,
          rating,
          reviewCount,
          category: data.category,
          phone: data.phone,
          address: data.address,
          latitude,
          longitude,
        });
      }
    } catch (innerErr) {
      // one bad listing should never stop the whole collection run
      continue;
    }
  }

  return results;
}

router.post('/v1/google-maps/search', async (req, res, next) => {
  const { searchUrl, maxResults, scrollWaitMs, maxScrollAttempts, navigationTimeoutMs } = req.body || {};

  if (!searchUrl || typeof searchUrl !== 'string') {
    return res.status(400).json({ error: 'searchUrl (string) is required' });
  }

  const params = {
    searchUrl,
    maxResults: Number.isFinite(maxResults) ? maxResults : 100,
    scrollWaitMs: Number.isFinite(scrollWaitMs) ? scrollWaitMs : 1800,
    maxScrollAttempts: Number.isFinite(maxScrollAttempts) ? maxScrollAttempts : 40,
  };

  const timeout = Math.min(
    Number.isFinite(navigationTimeoutMs) ? navigationTimeoutMs : config.defaultNavigationTimeoutMs,
    config.maxNavigationTimeoutMs
  );

  try {
    const businesses = await withPage((page) => scrapeGoogleMaps(page, params), {
      navigationTimeoutMs: timeout,
    });

    res.status(200).json({
      count: businesses.length,
      businesses,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
