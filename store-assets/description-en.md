# Chrome Web Store — Store Listing Description

---

## Short description (132 characters max)

Save avto.net listings, track price drops, get AI deal scores & instant notifications — your personal car garage.

---

## Full description

**AvtoNetGaraža** turns avto.net into a personal car research hub. Save any listing with one click, watch prices automatically, and get an AI-powered deal score injected directly onto every listing page — so you always know whether a car is worth your time before you pick up the phone.

---

### 🔖 Save vehicles with one click

A "Save to Garage" button appears on every avto.net listing. Tap it and the vehicle — photos, price, specs, mileage, fuel type, and the direct link — is stored locally in your browser. No account, no sign-up, no cloud.

---

### 💰 Automatic price tracking

AvtoNetGaraža checks every saved vehicle in the background and alerts you the moment a price changes by more than 50 €. You'll see:

- **▼ Price dropped** — with the exact amount in euros
- **🔴 Sold** — so you stop chasing a car that's already gone
- **🗑 Listing removed** — clean up your garage automatically

All checks run on a configurable schedule (default: every 60 minutes). A force-check button lets you refresh everything instantly.

---

### 🤖 Smart Advisor — AI deal scoring on every listing

A floating analysis panel is injected directly onto each avto.net listing page. It shows:

- **Overall score 0–100** with a visual ring
- **Sub-scores** for price, mileage, age, equipment level, and body condition
- **Price vs. market** — compared against similar listings currently active
- **Plain-language verdict** — e.g. "Price is 8% below market average for comparable models"
- **Actionable insights** — unusual mileage, equipment value, how long the listing has been active

---

### 📁 Folders & organisation

Create custom folders (e.g. "BMW Candidates", "Under 10k €", "Family Cars") and drag vehicles between them. Each folder shows an alert dot when any vehicle inside has changed. A built-in search filters by make, model, mileage, or fuel type.

---

### 🔔 Desktop notifications

Receive browser notifications for:
- Price drops
- Sold vehicles
- Removed listings
- Vehicle successfully saved

Notifications are deduplicated so you never get spammed.

---

### 🔒 Privacy first

- **All data stored locally** in `chrome.storage.local` — nothing ever leaves your browser
- **No account required** — zero sign-up, zero tracking
- **Minimal permissions** — only `storage`, `alarms`, `notifications`, and `*://*.avto.net/*` host access
- **No analytics, no telemetry**

---

### ⚙️ Technical details

- Works on **avto.net** (Slovenian used-car marketplace)
- Requires **Chrome 116** or newer
- All background checks use a strict 15-second timeout — a slow network never freezes the extension
- Resilient sold/removed detection — a temporary network error or CAPTCHA page does not incorrectly mark your vehicle as gone

---

### 📋 How to get started

1. Install the extension
2. Browse to any vehicle listing on avto.net
3. Click **"Shrani v garažo"** (Save to Garage) on the listing page — or click the extension icon in your toolbar
4. Open the popup to see your saved vehicles, price history, and AI scores

---

### Languages

Interface: **Slovenian** (sl-SI)
This description: English

---

*AvtoNetGaraža is an independent browser extension and is not affiliated with avto.net or Mimovrste d.o.o.*
