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

### Next steps (to be continued)
- TBD — waiting on next prompt from user
