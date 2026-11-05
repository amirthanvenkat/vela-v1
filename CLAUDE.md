# VELA project notes

A mobile-web banking and investing prototype for first-salary users. Vite + React 18 app; the README has the full layout, flows and design notes.

## Working on it

- `npm install`, then `npm run dev` (http://localhost:5777/). The `vela` config in `.claude/launch.json` starts the same dev server.
- Before committing: `npm run lint` and `npm test`. `npm run e2e` runs Playwright against the production build (first time: `npx playwright install chromium`).
- Routing is React Router 7 with hash URLs; every screen's path is in `SCREEN_PATHS` in `src/routes.js`.
- Business rules live in `src/lib/` (garden growth, withdrawals, goals, risk mixes) and have unit tests next to them. Copy for Learn articles and risk styles is in `src/data.js`.
- Demo links open any screen with seeded state, e.g. `#/home?demo` or `#/invest/done?demo&flowers=1&amt=50`. The docs screenshots in `docs/screenshots/` are captured this way.

## Shipping

- Work goes through pull requests to `main` on `amirthanvenkat/vela-v1`. Every push to `main` runs `.github/workflows/deploy.yml` (lint, unit tests, e2e, build) and deploys to https://amirthanvenkat.github.io/vela-v1/.
- `gh` is at `C:\Program Files\GitHub CLI\gh.exe` and may not be on PATH in tool shells.

## Copy rules

- British English.
- No em dashes and no AI-tell phrasing.
- No financial jargon; if a term is needed, follow it with a plain-language line. Tips say they are a guide, not advice.
- The brand is always written `VELA` in capitals.
