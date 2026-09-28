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
