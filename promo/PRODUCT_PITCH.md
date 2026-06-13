# PRODUCT PITCH — AvtoNetGarage

## One-Sentence Pitch

A Chrome extension for avto.net that saves car listings with one click, scores each one 0-100 for risk, tracks price changes hourly, and notifies you the moment something moves.

## Product Description

AvtoNetGarage lives inside avto.net — Slovenia's primary used car marketplace — and transforms it from a browsing experience into a research platform. On any vehicle listing page, a floating button appears. One click saves that listing to your personal garage. From that moment, the extension's background service worker polls the listing every hour, comparing the current price to what it was when you saved it. Price drops, price hikes, and "sold / removed" status all trigger Chrome notifications instantly — no refreshing, no spreadsheets.

Every saved listing also gets a Smart Advisor score: a 0-100 risk assessment that weighs red flags (accident history keywords, unusually low price, listing age, suspicious mileage patterns) against positives (full service history, recent inspection, price in line with market). The garage UI is a 700×620px popup with dark glassmorphism styling, custom colour-coded folders for organising listings, and full price history charts per vehicle. The stack is Chrome Extension MV3 with React and TypeScript compiled by Webpack — no native app, no server, no subscription.

## Best 5 Features

- **One-click save with floating button** — a persistent button injected directly into avto.net listing pages; no copy-pasting URLs, no switching tabs
- **Smart Advisor risk scoring** — every saved car gets a 0-100 score with specific red flags and positives listed, plus a price sanity check against comparable listings
- **Hourly price monitoring** — background service worker polls saved listings every hour and fires Chrome notifications on any price change or listing removal
- **Price history charts** — full timeline of every recorded price for each saved vehicle, so you can see if a seller has been dropping the price repeatedly
- **Colour-coded folders** — organise saved listings into custom named folders (e.g. "Under 5000€", "Diesel SUVs", "Shortlist") with distinct colours

## 30-Second Demo Flow

1. Navigate to a specific vehicle listing on avto.net — a floating "Shrani" (Save) button appears in the bottom-right corner of the page
2. Click the floating button — a brief confirmation animation plays and the car is added to the garage
3. Click the extension icon in Chrome toolbar — the 700×620px popup opens showing the saved listing card with make, model, price, mileage, and a Smart Advisor score badge (e.g. "Score: 47 — Medium Risk")
4. Click the score badge — the Smart Advisor panel expands: 2 red flags listed ("Price 18% below market average", "No service history mentioned"), 2 positives listed ("Recent technical inspection", "Single owner")
5. Click "Price History" on the listing card — a line chart shows the price was €6,200 when saved, dropped to €5,900 last week, and is now €5,700
6. Drag the listing card into a folder named "Shortlist" — the folder icon changes colour to confirm
7. Simulate a price change notification: show a Chrome desktop notification appearing — "BMW 320d price dropped from €5,900 to €5,700 on avto.net"

## Target Audience

Slovenian car buyers actively shopping on avto.net who are evaluating multiple listings simultaneously and want to track price movements, assess risk, and organise their research — without building their own spreadsheet.
