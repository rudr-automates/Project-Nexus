# Project Nexus — nexus-scraper
#
# This image intentionally does NOT bundle Chromium. It uses puppeteer-core,
# which is a client library only, and connects over the network to the
# already-running `browserless` service, which owns the actual browser
# runtime. That keeps this image small and keeps "who runs the browser"
# a single, shared responsibility (Browserless) instead of duplicating
# Chromium installs across every service that ever needs a browser.

FROM node:20-slim

WORKDIR /app

# Install dependencies first so Docker can cache this layer independently
# of application source changes.
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Basic container-level health check hitting the service's own /health route.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||4000)+'/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

USER node

CMD ["node", "src/server.js"]
