# Nestly — Know the True Cost Before You Fall in Love

> **Purpose of this README:** This is a complete reference document for the Nestly project. If you are returning to this project after a break, this file tells you everything — what the product is, what has been built, every tool and service used, every account you need access to, how to run it locally, how it is deployed, and what still needs to be done. Read this first.

---

## What is Nestly?

Nestly is a free Australian property buying calculator. Most property apps show you the asking price. Nestly shows you the **real total cost** of buying a home — stamp duty, Lender's Mortgage Insurance (LMI), conveyancing fees, building inspections, council rates, strata levies, and every government grant you qualify for.

**Tagline:** *"That $650k house actually costs $712,000."*

**Target audience:** Australian first home buyers and property buyers who don't know all the hidden upfront costs involved in purchasing property.

**Business model (planned):** Free web calculator as a lead generation tool. Full mobile app (iOS + Android) coming soon with AI advisor, lifestyle scoring, and a personalised buying journey tracker.

**Current status:** Live web calculator at https://nestly-production-37f9.up.railway.app — collecting email waitlist signups for the full app launch.

---

## Live URLs

| Environment | URL |
|---|---|
| Production (live) | https://nestly-production-37f9.up.railway.app |
| GitHub repo | https://github.com/sohaibmudassir/NESTLY |

---

## What Has Been Built So Far

### 1. True Cost Calculator
- Enter a property price, deposit amount, state/territory, and property type
- Calculates and displays a full cost breakdown including:
  - **Stamp duty** — correct 2026 rates for all 8 Australian states/territories
  - **First Home Buyer (FHB) concessions and exemptions** — automatically applied per state
  - **Lender's Mortgage Insurance (LMI)** — triggered when deposit is under 20%, with tiered estimates
  - **Conveyancing / legal fees** — estimated range
  - **Building & pest inspection** — estimated cost
  - **Council rates** (first year estimate)
  - **Strata / body corporate levies** — optional toggle for apartments, units, townhouses
- Comma formatting on all dollar inputs (e.g. 650,000 not 650000)
- WA-specific Metro/Peel vs Regional dropdown (March 2025 concession update)
- Government grant alert box showing grants available for your state
- LMI warning alert with explanation
- Disclaimer: "Last verified: May 2026"

### 2. Waitlist Signup
- iOS and Android waitlist buttons in the CTA section
- Modal popup with email form
- Emails saved to Supabase database (`waitlist` table)
- Platform tracked (ios / android)
- Duplicate email detection — shows "You're already on the waitlist!" instead of an error
- Invalid email validation
- Spinner while submitting, success message on completion
- PostHog event fired on signup

### 3. Analytics (PostHog)
Events tracked:
- `page_viewed` — on every page load
- `state_selected` — when user picks a state in the calculator
- `calculation_completed` — when user runs the calculator (includes price, state, deposit, LVR, total cost, FHB status)
- `waitlist_clicked` — when user opens the waitlist modal (includes platform: ios/android)
- `waitlist_signup` — when user successfully joins the waitlist (includes platform and email)

### 4. Backend API (Express)
- `GET /api/health` — health check endpoint
- `POST /api/waitlist` — accepts `{ email, platform }`, validates email, inserts into Supabase, returns success/duplicate/error response

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript | No framework needed — fast, simple, no build complexity |
| Dev server | Vite 5 | Fast hot-reload for local development |
| Backend | Node.js + Express | Lightweight API server |
| Database | Supabase (PostgreSQL) | Free tier, easy setup, built-in Row Level Security |
| Deployment | Railway | Auto-deploys from GitHub, single service for frontend + backend |
| Analytics | PostHog | Product analytics, event tracking, free tier |
| Fonts | Google Fonts | Playfair Display (headings) + DM Sans (body) |

---

## Project File Structure

```
nestly/
├── index.html              # Single-page app — all HTML, links to CSS + JS modules
├── css/
│   └── styles.css          # All styles — nav, hero, calculator, modal, footer
├── js/
│   ├── calculator.js       # Calculator logic: LMI, formatting, PostHog events
│   ├── stamp-duty.js       # Stamp duty rates for all 8 AU states (exported module)
│   └── waitlist.js         # Waitlist modal open/close, form submit, PostHog events
├── server/
│   ├── server.js           # Express server — CORS, static files, API routes
│   ├── package.json        # Server-level dependencies
│   └── .env                # Local env vars — NOT committed to GitHub
├── vite.config.js          # Vite config — proxies /api to localhost:3500 in dev
├── package.json            # Root package — npm start runs the Express server
├── .gitignore
└── README.md               # This file
```

---

## Accounts & Services You Need Access To

### Railway (Deployment)
- **URL:** https://railway.app
- **Project:** NESTLY → production service
- **Live domain:** nestly-production-37f9.up.railway.app
- **Auto-deploy:** Yes — every `git push` to the `main` branch triggers a new deployment
- **Variables set in Railway:**
  - `PORT` = 3500
  - `CLIENT_URL_PROD` = https://nestly-production-37f9.up.railway.app
  - `SUPABASE_URL` = your Supabase project URL (https://xxxx.supabase.co)
  - `SUPABASE_SERVICE_KEY` = your Supabase service_role secret key

### Supabase (Database)
- **URL:** https://supabase.com
- **Project name:** Nestly
- **Project ID:** wwzkuzaxddjfczsrgsbb
- **Table:** `public.waitlist`
  - `id` — uuid, primary key, auto-generated
  - `email` — text, UNIQUE, NOT NULL
  - `platform` — text, NOT NULL (value: "ios" or "android")
  - `created_at` — timestamptz, DEFAULT now(), NOT NULL
- **Row Level Security (RLS):** Enabled
- **Permissions granted:** `service_role`, `anon`, `authenticated` all have INSERT on the waitlist table
- **Keys needed:**
  - `SUPABASE_URL` — found at Settings → General → Project URL
  - `SUPABASE_SERVICE_KEY` — found at Settings → API Keys → Legacy → service_role (secret key). This is used server-side only and bypasses RLS.

### PostHog (Analytics)
- **URL:** https://posthog.com
- **Project key:** `phc_uEApUQ2mYz4aAFYthqvwr7NcSgJe2tAqfEHfk5e6SiHm`
- **API host:** `https://us.i.posthog.com`
- **Integration:** Snippet in `<head>` of index.html — no npm install required
- **Dashboard:** Log in to PostHog → Explore events to see live analytics

### GitHub
- **Repo:** https://github.com/sohaibmudassir/NESTLY
- **Branch:** `main`
- **Auto-deploy:** Railway watches this repo and deploys every push to `main`

---

## Running Locally

### Step 1 — Install dependencies
```bash
# From the project root
npm install

# Also install server dependencies
cd server
npm install
cd ..
```

### Step 2 — Set up environment variables
Create a file at `server/.env`:
```
PORT=3500
CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PROD=https://nestly-production-37f9.up.railway.app
SUPABASE_URL=https://wwzkuzaxddjfczsrgsbb.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### Step 3 — Run the Express backend
```bash
npm start
# Runs on http://localhost:3500
# Test it: http://localhost:3500/api/health
```

### Step 4 — Run the Vite frontend (in a separate terminal)
```bash
npm run dev
# Opens at http://localhost:5173
# API calls to /api/* are proxied to localhost:3500 via vite.config.js
```

---

## How Deployment Works

1. You write code locally and test with `npm run dev`
2. Run `git add` + `git commit` + `git push` to push to GitHub
3. Railway detects the push and automatically runs:
   - **Build:** `npm run build` (runs Vite, compiles JS/CSS to `dist/`)
   - **Start:** `npm start` → `node server/server.js`
4. Express server starts on port 3500 (set via `PORT` env var in Railway)
5. Express serves static files from the project root directory
6. Express also handles all `/api/*` routes
7. Any non-API route returns `index.html` (catch-all for single-page apps)

---

## Stamp Duty — States Covered

All rates verified as of May 2026. Rates are reviewed annually.

| State | FHB Exemption | FHB Concession | Notes |
|---|---|---|---|
| WA | ≤ $450,000 (metro), ≤ $400,000 (regional) | Sliding scale to $600k / $750k | Metro/Peel vs Regional dropdown added March 2025 |
| NSW | ≤ $800,000 | Sliding scale to $1,000,000 | First Home Buyer Assistance Scheme |
| VIC | ≤ $600,000 | Sliding scale to $750,000 | First Home Buyer duty reduction |
| QLD | ≤ $550,000 | Sliding scale to $700,000 | QLD First Home Concession |
| SA | No full exemption | 40% rebate up to $110,000 value | Partial concession only |
| TAS | 50% rebate on established homes | — | New builds get full concession |
| ACT | Household income-tested exemption | — | Based on income threshold |
| NT | Full exemption up to $650,000 | — | Territory Home Owner Grant also applies |

---

## API Reference

| Method | Endpoint | Body | Response |
|---|---|---|---|
| GET | `/api/health` | — | `{ "status": "ok", "app": "Nestly" }` |
| POST | `/api/waitlist` | `{ "email": "...", "platform": "ios" }` | `{ "success": true }` or `{ "error": "Already signed up" }` or `{ "error": "Invalid email" }` |

---

## Known Issues Fixed During Development

| Issue | Cause | Fix |
|---|---|---|
| Railway crash on deploy | `express` was only in `server/package.json`, not root `package.json` | Moved `express`, `cors`, `@supabase/supabase-js` to root `package.json` |
| "Application failed to respond" | Railway injected its own PORT but domain was mapped to 3500 | Set `PORT=3500` explicitly in Railway Variables |
| Vite build failed on Railway | Apostrophe in `'You're already on the waitlist!'` broke the JS string | Changed to template literal with backticks |
| Waitlist returned "permission denied" | Supabase table was created without GRANT permissions on the roles | Ran `GRANT ALL ON TABLE public.waitlist TO service_role; GRANT INSERT ON TABLE public.waitlist TO anon, authenticated;` |
| Modal button stuck "Submitting…" on reopen | `openWaitlistModal()` didn't reset button state after successful signup | Added `btn.disabled = false; btn.textContent = 'Notify me when it launches'` on modal open |
| Port conflict locally | Ports 3000 and 3001 were taken by another project | Settled on port 3500 |

---

## What's Planned Next (Full App)

The web calculator is a landing page for the full Nestly mobile app. Planned features:

1. **AI Advisor** — answers property questions in plain English at any time, no appointment
2. **Property Lifestyle Scoring** — scores saved properties against commute, school zones, walkability
3. **Buying Journey Tracker** — 7-stage personalised roadmap from first search to settlement
4. **Property Comparison** — compare multiple properties side by side with true cost totals
5. **iOS & Android app** — native mobile experience

---

## Important Notes

- **Not financial advice.** All calculations are estimates based on publicly available government rates. Always verify with a licensed conveyancer or financial advisor before making any property decision.
- **Rate verification:** Stamp duty rates and grant thresholds change each financial year. Review `js/stamp-duty.js` at the start of each new financial year (July 1) and update rates against each state revenue office website.
- **Service role key:** Never commit the Supabase service_role key to GitHub. It is stored only in Railway environment variables and your local `server/.env` file (which is in `.gitignore`).

---

## State Revenue Office Reference Links

Use these to verify stamp duty rates when they change:

- **WA:** https://www.revenue.wa.gov.au/taxes-and-duties/transfer-duty
- **NSW:** https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty
- **VIC:** https://www.sro.vic.gov.au/land-transfer-duty
- **QLD:** https://www.qld.gov.au/housing/buying-owning-home/advice-buying-home/transfer-duty
- **SA:** https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duties/real-property
- **TAS:** https://www.sro.tas.gov.au/duties/duty-on-property-transfers
- **ACT:** https://www.revenue.act.gov.au/duties/conveyance-duty
- **NT:** https://nt.gov.au/property/land-tax-and-duty/stamp-duty

---

*© 2026 Nestly Pty Ltd. General information only — not financial advice.*
