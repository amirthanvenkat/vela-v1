import { ARTICLES } from '../data';
import { SCREEN_TAB, ONBOARDING, pathFor } from '../routes';

// Reads key=value pairs from the query string and the hash. The hash is either a route with its own
// query (#/invest/done?demo&flowers=1) or a legacy deep link (#screen=investSuccess&flowers=1).
export function parseBoot(search = '', hash = '') {
  const h = hash.replace(/^#/, '');
  const hashQuery = h.startsWith('/') ? (h.split('?')[1] || '') : h;
  const p = {};
  [search.replace(/^\?/, ''), hashQuery].join('&').split('&').forEach((kv) => {
    const [k, v] = kv.split('=');
    if (k) p[k] = decodeURIComponent(v || '');
  });
  return p;
}

// A legacy deep link names a known screen (#screen=home). Anything else boots normally.
export function bootScreen(boot) {
  return boot.screen && (SCREEN_TAB[boot.screen] || ONBOARDING.includes(boot.screen)) ? boot.screen : null;
}

// Rewrites a legacy deep link to the router form, keeping its demo params:
// { screen: 'investSuccess', flowers: '1' } -> '#/invest/done?demo&flowers=1'
export function legacyToRoute(boot) {
  const screen = bootScreen(boot);
  if (!screen) return null;
  const { id, amt, ...rest } = boot;
  delete rest.screen;
  // Articles used to be linked by title; routes use their key.
  const articleId = id && (ARTICLES[id] ? id : Object.keys(ARTICLES).find((k) => ARTICLES[k].title === id));
  const [path, pathQuery] = pathFor(screen, { id: articleId, amt: amt || undefined }).split('?');
  const query = ['demo', pathQuery, ...Object.entries(rest).map(([k, v]) => `${k}=${encodeURIComponent(v)}`)]
    .filter(Boolean).join('&');
  return `#${path}?${query}`;
}

// "Trip to Japan:1000" -> { name: 'Trip to Japan', target: 1000 }
export function parseGoal(raw) {
  if (!raw) return null;
  const [name, target] = raw.split(':');
  return name && Number(target) > 0 ? { name, target: Number(target) } : null;
}

// Old #screen=… links (docs, shared demos) become routes before the router reads the URL.
const legacy = legacyToRoute(parseBoot('', window.location.hash)); // hash params only; ?query stays put
if (legacy) window.history.replaceState(null, '', legacy);

// Demo links (route + ?demo, e.g. #/invest/done?demo&flowers=1) seed their state from the URL.
export const BOOT = parseBoot(window.location.search, window.location.hash);
// Demo boots render their end state at once and never touch saved progress (used for docs screenshots).
export const INSTANT = 'demo' in BOOT;

// Saved demo state. Demo links ignore it (and don't write it) so screenshots stay deterministic.
export const STORE_KEY = 'vela:v1';
export const SAVED = (() => {
  if (INSTANT) return null;
  try { return JSON.parse(window.localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
})();

// Land somewhere sensible before the first render, so nothing redirects (and animates) on load:
// returning users skip the splash, new users start at it.
if (!INSTANT) {
  const route = window.location.hash.replace(/^#/, '').split('?')[0] || '/';
  const onboarded = !!(SAVED && SAVED.onboarded);
  const inOnboarding = route === '/' || ['/welcome', '/risk', '/name', '/garden-intro'].includes(route);
  if (onboarded && inOnboarding) window.history.replaceState(null, '', '#/home');
  else if (!onboarded && !inOnboarding) window.history.replaceState(null, '', '#/');
}

export const bootGoal = () => parseGoal(BOOT.goal);
export const seedActivity = () => [
  { id: 'seed', type: 'deposit', label: 'Salary from your bank', amount: 1240, at: Date.now() - 3 * 864e5 },
];
