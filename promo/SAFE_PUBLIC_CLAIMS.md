# SAFE PUBLIC CLAIMS — AvtoNetGarage

## SAFE TO CLAIM

These are accurate, verifiable statements about what the product does:

1. **Injects a floating save button into avto.net listing pages** — a content script adds the button to the DOM on matching avto.net URLs; this is a confirmed, implemented feature.
2. **Saves vehicle listings to chrome.storage.local** — all saved listing data (title, price, mileage, URL, timestamp) is stored locally in the browser; nothing is sent to a remote server.
3. **Background service worker polls saved listings hourly** — the MV3 service worker is configured to check saved listing URLs on a recurring schedule and compare prices.
4. **Fires Chrome notifications on price changes and sold/removed detection** — uses the Chrome Notifications API to alert users when a monitored listing changes status.
5. **Produces a Smart Advisor risk score from 0-100 per listing** — a scoring algorithm evaluates listing attributes and generates a numeric risk score with contributing factors listed.
6. **Records price history per listing and displays it as a chart** — each monitored listing accumulates a timestamped price log; this is rendered as a line chart in the popup.
7. **Supports colour-coded folders for organising saved listings** — users can create named folder categories and assign custom colours to group listings.
8. **Built with Chrome Extension Manifest V3, React, TypeScript, and Webpack** — the tech stack is accurate and verifiable from the source code and package.json.

---

## DO NOT CLAIM

Avoid these statements — they are unverified, exaggerated, or potentially misleading:

1. **"Works on all car marketplaces"** — the extension is specifically built for avto.net; do not claim compatibility with other marketplaces (mobile.de, AutoScout24, etc.) without confirmed implementation.
2. **"Smart Advisor uses real market data for price comparisons"** — unless the price sanity check fetches and compares live comparable listings, do not claim the price check is market-data-driven; describe it as a heuristic or algorithm-based assessment.
3. **"Never misses a price change"** — the hourly polling interval means changes within the hour window could be missed if the user's browser is closed; do not claim real-time or guaranteed detection.
4. **"Approved by avto.net"** — this is a third-party extension that scrapes avto.net; there is no affiliation, endorsement, or agreement with avto.net; do not imply otherwise.
5. **"Available on the Chrome Web Store"** — only claim this after the extension has been submitted, reviewed, and published; do not state it prematurely.
