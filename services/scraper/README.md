# nexus-scraper

Shared browser-automation service for Project Nexus.

## Purpose

`nexus-scraper` is the one place in the platform where Puppeteer code lives.
It connects to the existing `browserless` container over the internal
`nexus-network` and exposes a small, stable REST API. n8n — and every future
workflow — calls this API with plain HTTP requests. No workflow, and no n8n
Code node, ever requires Puppeteer, Playwright, Chromium, or an `npm install`
of its own.

## Responsibilities

- Own the Browserless connection (auth token, timeouts, cleanup).
- Own all DOM-selector logic for sites this platform automates against.
- Expose a versioned (`/v1/...`) JSON contract that is stable even if the
  underlying scraping implementation changes.

## Dependencies

- `browserless` service (Chromium runtime) — must be running and reachable
  at `BROWSERLESS_WS_ENDPOINT`.

## Configuration

All configuration is via environment variables (see the platform root
`.env` / `.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port this service listens on | `4000` |
| `BROWSERLESS_WS_ENDPOINT` | WebSocket endpoint of the `browserless` service | `ws://browserless:3000` |
| `BROWSERLESS_TOKEN` | Auth token for Browserless | *required* |
| `SCRAPER_NAV_TIMEOUT_MS` | Default per-page navigation timeout | `30000` |
| `SCRAPER_MAX_NAV_TIMEOUT_MS` | Hard cap a caller cannot exceed | `90000` |
| `SCRAPER_MAX_SCREENSHOT_DATA_URL_LENGTH` | Screenshot size cutoff (Google Sheets cell limit) | `45000` |
| `LOG_LEVEL` | Reserved for future structured-logging config | `info` |

## API

### `GET /health`

Returns service status and Browserless reachability. Used by the Docker
Compose healthcheck.

### `POST /v1/google-maps/search`

Request body:

```json
{
  "searchUrl": "https://www.google.com/maps/search/cat+cafe+Seattle",
  "maxResults": 100,
  "scrollWaitMs": 1800,
  "maxScrollAttempts": 40
}
```

Response body:

```json
{
  "count": 42,
  "businesses": [
    {
      "businessName": "...",
      "website": "...",
      "googleMapsUrl": "...",
      "rating": 4.5,
      "reviewCount": 120,
      "category": "...",
      "phone": "...",
      "address": "...",
      "latitude": 47.6,
      "longitude": -122.3
    }
  ]
}
```

Google Maps' DOM is not officially documented and changes over time. If
extraction quality degrades, update the selectors in
`src/routes/googleMaps.js` — this is the only file in the platform that
should ever need that kind of change.

### `POST /v1/screenshot`

Request body:

```json
{ "url": "https://example.com", "quality": 40 }
```

Response body:

```json
{ "screenshotDataUrl": "data:image/jpeg;base64,..." }
```

Returns an empty string (never an error) if the screenshot fails or exceeds
`maxDataUrlLength` — callers should treat a missing screenshot as
"skip", not "fail".

## Recovery

This service is stateless. If it crashes or is redeployed, restart it — it
holds no data of its own. If `browserless` is unavailable, `/health` will
report `dependencies.browserless: "unreachable"` and the scraping routes
will return `502`-class errors; no data is lost, callers should retry.

## Future improvements

- Add a shared request-concurrency guard here that respects
  `BROWSERLESS_CONCURRENT` so bursts of workflow runs queue politely
  instead of erroring.
- Add per-route unit tests once a second capability (beyond Google Maps
  and screenshots) is added, so selector regressions are caught before
  deploy.
- Wire `console.log` output into the platform's future centralized
  logging/monitoring stack instead of stdout only.
