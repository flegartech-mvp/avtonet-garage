/**
 * Fetches a saved vehicle URL and extracts current price/status.
 * Returns a diff object describing what changed (if anything).
 */

import { parseEuroPrice } from './parsePrice.js';

// ─── Fetch with timeout (Bug 16) ─────────────────────────────────────────────
// Previously there was no timeout — a slow/hanging avto.net response would
// block the monitoring batch indefinitely.

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000); // 15 s hard limit
  try {
    const res = await fetch(url, {
      credentials: 'omit',
      cache: 'no-store',
      headers: { 'Accept': 'text/html' },
      signal: controller.signal,
    });
    if (!res.ok) return { status: res.status, html: null };
    const html = await res.text();
    return { status: res.status, html };
  } catch {
    // AbortError (timeout) or network error both map to status 0
    return { status: 0, html: null };
  } finally {
    clearTimeout(timer);
  }
}

function extractFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // ─── Price ───────────────────────────────────────────────────────────────
  const priceSelectors = [
    '.price-box .price',
    '.ClassifiedAd .price',
    '[class*="price"]',
    '.cena',
    '#cena',
  ];
  let priceText = '';
  for (const sel of priceSelectors) {
    const el = doc.querySelector(sel);
    if (el && el.textContent.trim()) {
      priceText = el.textContent.trim();
      break;
    }
  }
  // Fallback: scan all leaf text nodes for € pattern
  if (!priceText) {
    const all = doc.body?.querySelectorAll('*') ?? [];
    for (const el of all) {
      if (el.children.length === 0 && /\d[\d.,]*\s*€/.test(el.textContent)) {
        priceText = el.textContent.trim();
        break;
      }
    }
  }

  // Bug 17 fix: use the shared parser so content-script and monitor agree
  const priceNum = parseEuroPrice(priceText);

  // ─── Sold detection (Bug 4) ───────────────────────────────────────────────
  // Previously checked doc.body.textContent for "prodano" which matched the
  // sidebar section "Podobna prodana vozila" on every active listing.
  // Fix: require the word to appear in the page title element or a dedicated
  // sold badge, not anywhere in the full body text.
  const titleEl = doc.querySelector('h1');
  const titleText = (titleEl?.textContent ?? '').toLowerCase();
  const soldBadge = doc.querySelector('.sold-badge, .prodano-badge, [class*="sold-badge"]');
  const bodyText = (doc.body?.textContent ?? '').toLowerCase();

  const isSold =
    soldBadge !== null ||
    titleText.includes('prodano') ||
    titleText.includes('sold') ||
    // These phrases are reliable full-body signals (avto.net specific)
    bodyText.includes('ni več na voljo') ||
    bodyText.includes('oglas je bil umaknjen');

  // ─── Removed detection (Bug 5) ───────────────────────────────────────────
  // Previously `!title` alone triggered "removed", which fired on any CAPTCHA,
  // login-redirect, or Cloudflare challenge page — mass-marking all vehicles
  // removed in a single bad check cycle.
  // Fix: require two independent signals, or one of the explicit error strings.
  const title = titleEl?.textContent?.trim() ?? '';
  const isRemoved =
    bodyText.includes('oglas ni najden') ||
    bodyText.includes('stran ni najdena') ||
    // "404" must co-occur with a missing title to avoid false matches in body
    (bodyText.includes('404') && !title);

  return { priceText, priceNum, isSold, isRemoved, title };
}

export async function checkVehicle(vehicle) {
  const { html, status } = await fetchPage(vehicle.url);

  // Bug 2 fix: a network error (status 0 = timeout / offline / CORS) must NOT
  // mark the vehicle as removed.  Previously `!html` caught status-0 and
  // permanently killed tracking for the listing on the first flaky request.
  if (status === 0) {
    return { changed: false, vehicleId: vehicle.id }; // transient — try again next cycle
  }

  if (status === 404 || status === 410 || !html) {
    return {
      changed: vehicle.status !== 'removed',
      type: 'removed',
      vehicleId: vehicle.id,
      title: vehicle.title,
      message: `Oglas odstranjen: ${vehicle.title}`,
    };
  }

  const current = extractFromHtml(html);

  if (current.isRemoved) {
    return {
      changed: vehicle.status !== 'removed',
      type: 'removed',
      vehicleId: vehicle.id,
      title: vehicle.title,
      message: `Oglas ni več na voljo: ${vehicle.title}`,
    };
  }

  if (current.isSold) {
    return {
      changed: vehicle.status !== 'sold',
      type: 'sold',
      vehicleId: vehicle.id,
      title: vehicle.title,
      message: `Vozilo prodano: ${vehicle.title}`,
    };
  }

  // ─── Price change ─────────────────────────────────────────────────────────
  // Bug 17 fix: use shared parseEuroPrice instead of local parsePrice so the
  // saved priceNum and the freshly-extracted priceNum are always comparable.
  const savedPrice = vehicle.priceNum ?? parseEuroPrice(vehicle.price);
  const newPrice = current.priceNum;

  if (savedPrice && newPrice && Math.abs(newPrice - savedPrice) > 50) {
    const diff = newPrice - savedPrice;
    const sign = diff < 0 ? '▼' : '▲';
    const abs = Math.abs(diff).toLocaleString('sl-SI');
    return {
      changed: true,
      type: 'price_change',
      vehicleId: vehicle.id,
      title: vehicle.title,
      oldPrice: savedPrice,
      newPrice,
      message: `${sign} Cena spremenjena za ${abs} € — ${vehicle.title}`,
    };
  }

  return { changed: false, vehicleId: vehicle.id };
}
