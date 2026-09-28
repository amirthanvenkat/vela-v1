import { SCREEN_TAB, ONBOARDING } from '../routes';

// Reads key=value pairs from the query string and the hash, e.g.
// ?frame=0#screen=investSuccess&flowers=1 -> { frame: '0', screen: 'investSuccess', flowers: '1' }
export function parseBoot(search = '', hash = '') {
  const p = {};
  [search.replace(/^\?/, ''), hash.replace(/^#/, '')].join('&').split('&').forEach((kv) => {
    const [k, v] = kv.split('=');
    if (k) p[k] = decodeURIComponent(v || '');
  });
  return p;
}

// A deep link names a known screen (#screen=home). Anything else boots normally.
export function bootScreen(boot) {
  return boot.screen && (SCREEN_TAB[boot.screen] || ONBOARDING.includes(boot.screen)) ? boot.screen : null;
}

// "Trip to Japan:1000" -> { name: 'Trip to Japan', target: 1000 }
export function parseGoal(raw) {
  if (!raw) return null;
  const [name, target] = raw.split(':');
  return name && Number(target) > 0 ? { name, target: Number(target) } : null;
}

// Optional deep links for demos and docs screenshots, e.g. #screen=investSuccess&flowers=1
// (also reads ?frame=0 from the query string).
export const BOOT = parseBoot(window.location.search, window.location.hash);
export const BOOT_SCREEN = bootScreen(BOOT);
// Deep-linked boots render their end state at once (used for docs screenshots).
export const INSTANT = !!BOOT_SCREEN;
// In-app navigation writes #/<screen> so a refresh can come back to the same tab.
export const ROUTE = window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : null;

// Saved demo state. Deep links ignore it (and don't write it) so screenshots stay deterministic.
export const STORE_KEY = 'vela:v1';
export const SAVED = (() => {
  if (INSTANT) return null;
  try { return JSON.parse(window.localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
})();

export const bootGoal = () => parseGoal(BOOT.goal);
export const seedActivity = () => [
  { id: 'seed', type: 'deposit', label: 'Salary from your bank', amount: 1240, at: Date.now() - 3 * 864e5 },
];
