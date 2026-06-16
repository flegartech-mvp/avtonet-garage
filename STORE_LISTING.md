# Chrome Web Store Listing — AvtoNetGaraža

Listing copy lives in `store-assets/description-en.md`; promo/screenshot assets are in `store-assets/` (icon 128, promo tile 440×280, marquee 1400×560, screenshots 1280×800). Privacy policy: `PRIVACY.md` and `docs/privacy-policy.html`.

## Summary for submission
| Field | Value |
|-------|-------|
| Name | AvtoNetGaraža |
| Version | 1.0.3 (from `manifest.json`) |
| Min Chrome | 116 |
| Category | Shopping / Productivity |
| Single purpose | Save avto.net listings, track price/status changes, notify the user |
| Permissions | `storage`, `notifications`, `alarms`; host `*://*.avto.net/*` — see [PERMISSIONS_JUSTIFICATION.md](PERMISSIONS_JUSTIFICATION.md) |
| Privacy policy | [PRIVACY.md](PRIVACY.md) (no data collection / transmission) |
| Package | `avtonet-garaza-1.0.3.zip` (`npm run package`) |

## Pre-submission checklist
- [x] MV3 manifest, minimal permissions, avto.net-scoped host
- [x] Icons 16/48/128 present and referenced
- [x] `npm run validate` passes (lint + tests + audit + build)
- [x] Release ZIP built from `dist/` with forward-slash entries, integrity-verified
- [x] Privacy policy + permission justification written
- [x] Parser degrades gracefully if avto.net markup changes
- [ ] Load unpacked `dist/` in `chrome://extensions` and run [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- [ ] Submit (requires developer account — manual approval step)
