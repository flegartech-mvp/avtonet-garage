# SOCIAL CAPTIONS — AvtoNetGarage

## TikTok / Reels (casual, punchy, max 150 chars)

```
Shrani avto z avto.net z enim klikom. Dobi oceno tveganja. Prejmi obvestilo, ko cena pade. 🚗📉
#avtonet #slovenija #avto #chromeextension #shoppinghacks
```

---

## X / Twitter (under 280 chars)

```
Built a Chrome extension for avto.net (Slovenian car marketplace).

Save listings with one click. Get a 0-100 risk score per car. Track price changes hourly. Get notified when something drops.

No subscription. No account. Free.

→ github.com/flegartech/AvtoNetGarage
```

---

## LinkedIn (2-3 short paragraphs, professional but not dry)

Buying a used car in Slovenia means spending hours refreshing avto.net listings, manually comparing prices, and hoping you notice when a seller drops their price. I built a Chrome extension to handle all of that automatically.

AvtoNetGarage injects a save button directly into every avto.net listing page. One click adds the car to your garage. A background service worker then polls saved listings every hour and fires a Chrome notification the moment a price changes or a listing is removed. Each car also gets a Smart Advisor score — a 0-100 risk assessment with specific red flags and positives, plus a price sanity check. Price history charts let you see whether a seller has been gradually dropping their ask or sitting firm.

It's a Chrome MV3 extension built with React, TypeScript, and Webpack. No server, no account, no subscription. If you or someone you know is car shopping in Slovenia, the repo is public.
