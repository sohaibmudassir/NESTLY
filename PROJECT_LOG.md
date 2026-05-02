# Nestly — Project Log

## Session 1 — 2026-04-30 / 2026-05-01

### What was built
- Created a new Vite project called **Nestly** at:
  `C:\Users\sohai\OneDrive\All Coding Projects\My RealEstate AI\Vibe Code\nestly\`
- Stack: pure vanilla HTML, CSS, JavaScript — no frameworks
- Vite used as dev server only

### Folder structure
```
nestly/
├── index.html            ← clean HTML structure only
├── package.json          ← Vite dev dependency
├── css/
│   └── styles.css        ← all styles (CSS variables, nav, hero, calculator, results, footer)
├── js/
│   ├── calculator.js     ← main logic: fmt, calcLMI, toggleFHB, toggleStrata, calculate(), event listeners
│   └── stamp-duty.js     ← calcStampDuty() exported as ES module, covers all 8 AU states/territories
└── assets/               ← empty, reserved for logo and images
```

### What the site does
- **True Cost Calculator** for Australian property buyers
- Inputs: property price, deposit, state/territory, property type, first home buyer toggle, strata toggle
- Outputs: total true cost = asking price + stamp duty + LMI + conveyancing + pest inspection + council rates + strata
- Covers all 8 states/territories with correct 2026 stamp duty rates and FHB exemptions/grants
- LMI calculated when LVR > 80%
- Animated results section with cost breakdown

### Key technical decisions
- `stamp-duty.js` exports `calcStampDuty` as an ES module
- `calculator.js` imports from `stamp-duty.js` — only one `<script type="module">` tag needed in HTML
- `toggleFHB`, `toggleStrata`, `calculate` exposed via `window.*` so inline `onclick` HTML attributes work with ES module scope

### Dev server
```bash
cd "C:\Users\sohai\OneDrive\All Coding Projects\My RealEstate AI\Vibe Code\nestly"
npm run dev
# → http://localhost:5173
```

---

## Session 2 — 2026-05-01 / 2026-05-02

### 1. Added Express backend server

Created `server/server.js` — a Node.js + Express server that:
- Serves all static frontend files from the project root
- Exposes `GET /api/health` route
- Handles CORS for dev (localhost:5173) and production (Railway URL)
- Catches all non-API routes and returns `index.html` (single-page app fallback)

Created `server/.env` (not committed to GitHub):
```
PORT=3500
CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PROD=https://nestly-production-37f9.up.railway.app
SUPABASE_URL=https://wwzkuzaxddjfczsrgsbb.supabase.co
SUPABASE_SERVICE_KEY=<service role key from Supabase>
```

Created `vite.config.js`:
- Proxies all `/api/*` requests to `http://localhost:3500` during Vite dev server so frontend and backend work together locally without CORS issues.

Moved `express`, `cors`, `@supabase/supabase-js` to root `package.json` (not just `server/package.json`) so Railway can find them during its build.

---

### 2. Deployed to Railway

- Platform: https://railway.app
- Deployment method: GitHub auto-deploy — every `git push` to `main` triggers a new Railway deployment
- GitHub repo: https://github.com/sohaibmudassir/NESTLY
- Live URL: https://nestly-production-37f9.up.railway.app

**Railway build process:**
1. Railway runs `npm run build` → Vite builds frontend
2. Railway runs `npm start` → `node server/server.js`
3. Express serves both frontend (static files) and API from the same port

**Railway Variables set:**
- `PORT` = 3500
- `CLIENT_URL_PROD` = https://nestly-production-37f9.up.railway.app
- `SUPABASE_URL` = https://wwzkuzaxddjfczsrgsbb.supabase.co
- `SUPABASE_SERVICE_KEY` = (service_role secret key from Supabase Settings → API Keys → Legacy)

**Issues encountered and fixed:**

| Problem | Cause | Fix |
|---|---|---|
| Railway crash — express not found | `express` was only in `server/package.json`, not root | Moved to root `package.json` |
| Port conflict locally | Ports 3000 and 3001 taken by another app | Settled on port 3500 |
| "Application failed to respond" on Railway | Railway injects its own PORT but domain was mapped to 3500 | Added `PORT=3500` explicitly in Railway Variables |

---

### 3. Comma formatting on price inputs

- Changed price and deposit inputs from `type="number"` to `type="text"` with `inputmode="numeric"`
- Added `formatInputAsCommas()` function in `calculator.js` — formats the number with commas as user types (e.g. 650,000)
- Added `parseInput()` function — strips commas before calculation so the math still works
- Result: inputs display as `$650,000` but calculate correctly as `650000`

---

### 4. "Last verified" disclaimer

Added to the results section in `index.html`:
> *Last verified: May 2026 · Stamp duty rates and grant thresholds are reviewed annually and updated each financial year.*

---

### 5. WA First Home Buyer concession update (March 2025 changes)

Updated `js/stamp-duty.js` to reflect the March 2025 WA changes:
- Added a `wa-region` dropdown to the calculator (Metro/Peel vs Regional WA)
- The dropdown only appears when WA is selected
- **New rates:**
  - Full exemption ≤ $500,000 (both Metro and Regional)
  - Metro/Peel: sliding concession from $500,001 to $700,000
  - Regional WA: sliding concession from $500,001 to $750,000
- Updated `calculator.js` to show/hide the WA region dropdown and pass `waRegion` to `calcStampDuty()`

---

### 6. PostHog analytics

Added PostHog JavaScript snippet to `<head>` of `index.html`.

**PostHog project key:** `phc_uEApUQ2mYz4aAFYthqvwr7NcSgJe2tAqfEHfk5e6SiHm`

**Events tracked:**

| Event | Where fired | Properties |
|---|---|---|
| `page_viewed` | `calculator.js` on load | — |
| `state_selected` | `calculator.js` on state dropdown change | `state` |
| `calculation_completed` | `calculator.js` inside `calculate()` | `state`, `price`, `deposit`, `lvr`, `total_cost`, `is_fhb` |
| `waitlist_clicked` | `waitlist.js` inside `openWaitlistModal()` | `platform` (ios/android) |
| `waitlist_signup` | `waitlist.js` on successful form submit | `platform`, `email` |

---

### 7. Email waitlist with Supabase

**Purpose:** Collect iOS and Android waitlist signups before the full app launches.

**Supabase setup:**
- Project name: Nestly
- Project ID: `wwzkuzaxddjfczsrgsbb`
- Project URL: `https://wwzkuzaxddjfczsrgsbb.supabase.co`

**Table created in Supabase SQL Editor:**
```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  platform text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON waitlist;
CREATE POLICY "Service role only" ON waitlist
  FOR ALL USING (false);
```

**Permissions granted (separate SQL run):**
```sql
GRANT ALL ON TABLE public.waitlist TO service_role;
GRANT INSERT ON TABLE public.waitlist TO anon;
GRANT INSERT ON TABLE public.waitlist TO authenticated;
```

**Files added/updated:**

`js/waitlist.js` — modal open/close, form submit handler:
- Opens modal with `openWaitlistModal('ios')` or `openWaitlistModal('android')`
- Resets form + button state on every open
- POSTs `{ email, platform }` to `/api/waitlist`
- Shows spinner while submitting
- On success: hides form, shows success message with email address
- On duplicate: shows "You're already on the waitlist!"
- On invalid email: shows "Please enter a valid email address."

`server/server.js` — added `POST /api/waitlist` route:
- Validates email format with regex
- Inserts `{ email, platform }` into Supabase `waitlist` table
- Detects duplicate via Supabase error code `23505` → returns `{ error: 'Already signed up' }`
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` environment variables (server-side only)

`index.html` — added waitlist modal HTML before `</body>`:
- Modal overlay with close button (×), Nestly logo, heading, email input, submit button
- Hidden by default, shown via `openWaitlistModal()`
- iOS and Android buttons in CTA section call `openWaitlistModal('ios')` / `openWaitlistModal('android')`

**Important — Supabase keys:**
- Only the `service_role` key is used (not the anon/public key)
- The service_role key bypasses Row Level Security
- It is stored ONLY in Railway Variables and `server/.env` — never in frontend code or committed to GitHub

---

### 8. Bugs fixed in Session 2

| Bug | Cause | Fix |
|---|---|---|
| Vite build failed on Railway | Apostrophe in `'You're already on the waitlist!'` broke the JS string literal | Changed to template literal: `` `You're already on the waitlist!` `` |
| Waitlist returned "permission denied" (Supabase error 42501) | Table created without GRANT permissions for the Supabase roles | Ran `GRANT ALL ON TABLE public.waitlist TO service_role` + `GRANT INSERT` to `anon` and `authenticated` |
| Modal button stuck on "Submitting…" when reopened | `openWaitlistModal()` didn't reset button state after successful submission | Added `btn.disabled = false; btn.textContent = 'Notify me when it launches'` inside `openWaitlistModal()` |
| "Something went wrong" with no useful message | Client didn't handle `{ error: 'Server error' }` response from server | Added `data.detail` display + debug logging in `server.js` (Supabase error code, message, and whether env vars are set) |

---

### 9. README updated

`README.md` fully rewritten to be a complete reference document covering:
- Project purpose and current status
- Live URLs (production + GitHub)
- Everything built so far (calculator, waitlist, analytics, API)
- Every tool and service used with account details
- How to run locally (step by step)
- How Railway deployment works
- Stamp duty table for all 8 states (rates as of May 2026)
- All bugs fixed with cause and solution
- State revenue office links for annual rate verification
- What's planned for the full app

---

### Git commits in Session 2 (in order)

| Commit | Message |
|---|---|
| (early) | Add Express backend, Railway deployment config |
| (early) | Add comma formatting to price/deposit inputs |
| (early) | Add last verified disclaimer |
| (early) | Update WA FHB concession for March 2025 (Metro/Peel vs Regional) |
| (early) | Add PostHog analytics: page_viewed, state_selected, calculation_completed, waitlist_clicked |
| 2a5d0d6 | Add email waitlist: modal, Supabase backend route, PostHog events |
| 14d7dcb | Fix apostrophe syntax error in waitlist.js |
| dfdf572 | Add debug logging to diagnose Supabase error |
| 192225d | Fix waitlist modal button state reset on reopen |
| 4cffd53 | Update README with full project reference documentation |
| c0ba895 | Fix WA stamp duty figures in README (March 2025 correct rates) |

---

### Current state at end of Session 2

- Live at: https://nestly-production-37f9.up.railway.app
- Calculator: fully working for all 8 AU states
- Waitlist: fully working — emails saved to Supabase with platform tag
- Analytics: PostHog tracking all key events
- README: comprehensive reference document
- GitHub: all code pushed, Railway auto-deploys on every push to `main`
