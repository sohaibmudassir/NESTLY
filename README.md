# Nestly

**Know the true cost before you fall in love.**

Nestly is a free Australian property buying calculator that shows you the real cost of purchasing a home — not just the asking price. It calculates stamp duty, Lender's Mortgage Insurance (LMI), conveyancing, building inspections, council rates, and strata levies across all 8 Australian states and territories.

---

## What it does

- Calculates the **true total cost** of buying any property in Australia
- Covers **all 8 states and territories** with correct 2026 stamp duty rates
- Applies **First Home Buyer exemptions and concessions** automatically
- Shows **LMI warnings** when your deposit is under 20%
- Displays **government grants** you may be eligible for
- Works for houses, apartments, townhouses, and vacant land

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Dev server | Vite |
| Backend | Node.js + Express |
| Deployment | Railway (full stack) |

No frameworks. No build step required for the frontend. Express serves the static files in production.

---

## Project structure

```
nestly/
├── index.html              # Main page
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── calculator.js       # Main calculator logic, LMI, event listeners
│   └── stamp-duty.js       # Stamp duty calculations for all 8 AU states
├── assets/                 # Logo and images (empty — add your own)
├── server/
│   ├── server.js           # Express server — serves frontend + API routes
│   ├── package.json        # Server dependencies (express, cors)
│   └── .env                # Environment variables (not committed)
├── package.json            # Root package — start script for Railway
├── .gitignore
└── README.md
```

---

## Running locally

### Frontend (Vite dev server)
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Backend (Express)
```bash
cd server
npm install
cd ..
npm start
# → http://localhost:3500
# → http://localhost:3500/api/health
```

In production, `npm start` runs Express which serves both the frontend and the API from a single port.

---

## API routes

| Method | Route | Response |
|--------|-------|----------|
| GET | `/api/health` | `{ "status": "ok", "app": "Nestly" }` |

---

## Environment variables

Create a `server/.env` file (not committed):

```
PORT=3500
CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PROD=https://your-railway-domain.up.railway.app
```

On Railway, `PORT` is injected automatically.

---

## Deployment (Railway)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repository — Railway auto-detects Node.js and runs `npm start`
4. Add `CLIENT_URL_PROD` in Railway's Variables tab
5. Your live URL will be `https://your-project.up.railway.app`

---

## States covered

Western Australia · New South Wales · Victoria · Queensland · South Australia · Tasmania · Australian Capital Territory · Northern Territory

---

*General information only — not financial advice. Always consult a licensed professional before making any property decision.*
