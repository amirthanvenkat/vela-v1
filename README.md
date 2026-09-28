# VELA

*Your money, moving.*

A mobile-web banking and investing prototype for young people getting their first salary.
It is built to be opened on a phone (375px / iPhone viewport) and shared as a single HTML link.

**Live demo: https://amirthanvenkat.github.io/vela-v1/**

Open that link on your phone for the intended experience. To use it like an app, open your
browser menu and choose "Add to Home Screen"; it will launch full screen from its own icon.
On a laptop or desktop it opens inside an iPhone-style frame:

![VELA inside the desktop phone frame](docs/screenshots/00-desktop-frame.png)

| Home | First investment | Your garden |
|---|---|---|
| ![Home dashboard](docs/screenshots/04-home.png) | ![First bloom success screen](docs/screenshots/08-invest-success.png) | ![Garden introduction](docs/screenshots/03-garden-intro.png) |

Want to see how it feels to use? Read [Maya's user story](docs/user-story-maya.md), a
screen-by-screen walkthrough from the point of view of a first-salary user.

## How to open

Open **`index.html`** in any modern browser. That single file is the whole app. There is no
build step, no install, and no backend. You can drag it onto a browser tab, or host the one
file anywhere (GitHub Pages, Netlify drop, S3, and so on) and share the link.

The app loads React, Tailwind, Framer Motion, and its fonts from public CDNs, so it needs an
internet connection the first time a browser opens it.

On a desktop browser (at least 600px wide and 640px tall) the app renders inside an iPhone-style
frame with a Dynamic Island, status bar and home indicator. The frame scales down to fit shorter
windows, and the screen inside always stays at 390x844, so layouts never reflow. On a phone it
fills the screen as before. Add `?frame=0` (or `&frame=0` in a deep link) to turn the frame off,
or `frame=1` to force it on.

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
3. Home extras: a "Recent" activity list and a notifications sheet behind the bell (with an unread dot)
4. Save: savings pot, set or edit a goal (name + target, with a progress bar), add money with preset chips, then a confirmation screen
5. Invest: garden, choose an amount (SGD 20 / 50 / 100 or your own, minimum SGD 10), then a "First bloom" moment where the garden springs up, a flower opens, and coral and leaf confetti falls
6. Learn: three jargon-free explainer cards that open a simple article reader
7. Settings: Light, Dark, and Moss themes, edit name, retake the risk choice, an About section, and Reset demo

Saving and investing can't take more than your balance; the screen explains why the button is
disabled instead of letting the balance go negative.

### Demo state

Maya, SGD 1,240.00 balance, Fox (Balanced) risk choice, a one-seed garden, and SGD 320 in the Savings Pot.

Your progress is saved in the browser (`localStorage`), so a refresh keeps your name, balance,
garden, goal and theme, and returns you to the tab you were on. **You > Reset demo** clears it
and starts again from the splash screen. The browser back button (and Android back gesture) moves
between screens inside the app.

## Design notes and one substitution

- Router: the brief lists React Router DOM. In a single-file build with no bundler, this uses a
  small custom stack router (a history stack plus Framer Motion's `AnimatePresence`) instead. It
  keeps the same screen model and adds the left/right slide transitions the brief asks for. Moving
  to `react-router-dom` later is straightforward if the app is rebuilt as a Vite project.
- Themes are driven by CSS variables, so every screen restyles instantly.
- The "3D glass" icons are approximated with glossy gradient bubbles wrapping an emoji.
- The bottom navigation has 5 line icons (Home, Save, Invest, Learn, You), with "You" opening Settings.
- Tappable cards work with the keyboard (Tab, then Enter or Space), and animations follow the
  system "reduce motion" setting (no confetti or slides when it is on).
- The copy avoids financial jargon. Where a term is needed, it is followed by a plain-language line.
- Any screen can be opened directly with a hash deep link, which is how the docs screenshots
  are captured. For example `#screen=home`, `#screen=investSuccess&flowers=1&amt=50`,
  `#screen=save&goal=Trip%20to%20Japan:1000`, or `#screen=settings&theme=dark&frame=0`.
  Deep links always start from the demo state: they don't read or overwrite saved progress.

## Moving to a Vite project later

This was built as a single HTML file because that is the requested deliverable (a single HTML
link to host) and the build machine had no Node.js. To convert it to the Vite structure in the
brief: create a Vite React app, move the `<script type="text/babel">` body into `src/` modules,
install `framer-motion`, `tailwindcss`, and `react-router-dom`, then drop the CDN tags.
