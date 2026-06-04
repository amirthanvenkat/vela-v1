# VELA

*Your money, moving.*

A mobile-web banking and investing prototype for young people getting their first salary.
It is built to be opened on a phone (375px / iPhone viewport) and shared as a single HTML link.

## How to open

Open **`index.html`** in any modern browser. That single file is the whole app. There is no
build step, no install, and no backend. You can drag it onto a browser tab, or host the one
file anywhere (GitHub Pages, Netlify drop, S3, and so on) and share the link.

On desktop it renders inside a centred phone frame. On a phone it fills the screen.

### Local preview (optional)

A small PowerShell static server is included if you want to run it locally:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 5777
# then visit http://localhost:5777/
```

## What's inside

One self-contained file (`index.html`) using:

- React 18, Framer Motion 11, and Tailwind CSS, all loaded from a CDN
- Babel Standalone, so JSX runs directly in the browser with no bundler
- Google Fonts: Fraunces for headlines, DM Sans for the interface, DM Mono for numbers

### Flows

1. Onboarding: Splash (auto-advances), Welcome, "What's your vibe" risk choice (🐢 / 🦊 / 🚀), Name, Garden intro
2. Home: greeting, balance card, garden tile, quick actions, and a 5-tab bottom navigation bar
3. Save: savings pot, set a goal, add money with preset chips, then a confirmation screen
4. Invest: garden, confirm, then a "First bloom" moment where the garden springs up, a flower opens, and coral and leaf confetti falls
5. Learn: three jargon-free explainer cards that open a simple article reader
6. Settings: Light, Dark, and Moss themes, edit name, retake the risk choice, and an About section

### Demo state

Maya, SGD 1,240.00 balance, Fox (Balanced) risk choice, a one-seed garden, and SGD 320 in the Savings Pot.

## Design notes and one substitution

- Router: the brief lists React Router DOM. In a single-file build with no bundler, this uses a
  small custom stack router (a history stack plus Framer Motion's `AnimatePresence`) instead. It
  keeps the same screen model and adds the left/right slide transitions the brief asks for. Moving
  to `react-router-dom` later is straightforward if the app is rebuilt as a Vite project.
- Themes are driven by CSS variables, so every screen restyles instantly.
- The "3D glass" icons are approximated with glossy gradient bubbles wrapping an emoji.
- The bottom navigation has 5 icons (Home, Save, Invest, Learn, You), with "You" opening Settings.
- The copy avoids financial jargon. Where a term is needed, it is followed by a plain-language line.

## Moving to a Vite project later

This was built as a single HTML file because that is the requested deliverable (a single HTML
link to host) and the build machine had no Node.js. To convert it to the Vite structure in the
brief: create a Vite React app, move the `<script type="text/babel">` body into `src/` modules,
install `framer-motion`, `tailwindcss`, and `react-router-dom`, then drop the CDN tags.
