import { matchPath } from 'react-router';

// Which tab a screen belongs to (drives bottom nav highlight & presence).
export const SCREEN_TAB = {
  home: 'home',
  save: 'save', addMoney: 'save', saveConfirm: 'save', setGoal: 'save',
  invest: 'invest', investConfirm: 'invest', investSuccess: 'invest',
  learn: 'learn', learnArticle: 'learn',
  settings: 'settings', retakeRisk: 'settings',
};
export const ONBOARDING = ['splash', 'welcome', 'risk', 'name', 'gardenIntro'];
// Modal-style flow screens: they own the full height (their own back/exit CTA), no bottom nav.
export const NAV_HIDDEN = ['addMoney', 'saveConfirm', 'setGoal', 'investConfirm', 'investSuccess', 'retakeRisk'];
// Screens with a dark or coloured top edge get a light status bar in the phone frame.
export const DARK_TOP = ['splash', 'gardenIntro', 'home', 'saveConfirm', 'investSuccess'];

// Bottom navigation tabs (the "You" tab opens Settings).
export const TABS = [
  { key: 'home',   label: 'Home' },
  { key: 'save',   label: 'Save' },
  { key: 'invest', label: 'Invest' },
  { key: 'learn',  label: 'Learn' },
  { key: 'settings', label: 'You' },
];

// URL for each screen (hash routes, e.g. #/save/add). Tab roots keep their pre-router URLs.
export const SCREEN_PATHS = {
  splash: '/',
  welcome: '/welcome',
  risk: '/risk',
  name: '/name',
  gardenIntro: '/garden-intro',
  home: '/home',
  save: '/save',
  addMoney: '/save/add',
  setGoal: '/save/goal',
  saveConfirm: '/save/done',
  invest: '/invest',
  investConfirm: '/invest/plant',
  investSuccess: '/invest/done',
  learn: '/learn',
  learnArticle: '/learn/:id',
  settings: '/settings',
  retakeRisk: '/settings/style',
};

// pathFor('learnArticle', { id: 'risk' }) -> '/learn/risk'; pathFor('saveConfirm', { amt: 40 }) -> '/save/done?amt=40'
export function pathFor(screen, params = {}) {
  let path = (SCREEN_PATHS[screen] || '/home').replace(':id', encodeURIComponent(params.id ?? ''));
  if (params.amt != null) path += '?amt=' + encodeURIComponent(params.amt);
  return path;
}

// '/learn/risk' -> { screen: 'learnArticle', params: { id: 'risk' } }; unknown paths -> null
export function screenFromPath(pathname) {
  for (const [screen, path] of Object.entries(SCREEN_PATHS)) {
    const m = matchPath({ path, end: true }, pathname);
    if (m) return { screen, params: m.params };
  }
  return null;
}
