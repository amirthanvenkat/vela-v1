import { describe, expect, it, vi } from 'vitest';

// boot.js reads the URL and localStorage at import time.
vi.stubGlobal('window', {
  location: { search: '', hash: '' },
  localStorage: { getItem: () => null },
  history: { replaceState: () => {} },
});
const { parseBoot, bootScreen, legacyToRoute, parseGoal } = await import('./boot');

describe('parseBoot', () => {
  it('reads the query of a hash route', () => {
    expect(parseBoot('', '#/invest/done?demo&flowers=1')).toEqual({ demo: '', flowers: '1' });
  });
  it('merges the page query string', () => {
    expect(parseBoot('?frame=0', '#/home?demo')).toEqual({ frame: '0', demo: '' });
  });
  it('reads legacy deep links and decodes values', () => {
    expect(parseBoot('', '#screen=learnArticle&id=What%20is%20investing%3F'))
      .toEqual({ screen: 'learnArticle', id: 'What is investing?' });
  });
  it('ignores plain routes', () => {
    expect(parseBoot('', '#/save')).toEqual({});
  });
});

describe('bootScreen', () => {
  it('accepts known screens only', () => {
    expect(bootScreen({ screen: 'investSuccess' })).toBe('investSuccess');
    expect(bootScreen({ screen: 'nope' })).toBeNull();
  });
});

describe('legacyToRoute', () => {
  it('rewrites #screen= links to demo routes', () => {
    expect(legacyToRoute({ screen: 'investSuccess', flowers: '1', amt: '50' }))
      .toBe('#/invest/done?demo&amt=50&flowers=1');
    expect(legacyToRoute({ screen: 'settings', theme: 'dark' })).toBe('#/settings?demo&theme=dark');
  });
  it('maps article titles to article routes', () => {
    expect(legacyToRoute({ screen: 'learnArticle', id: 'What is investing?' })).toBe('#/learn/investing?demo');
  });
  it('keeps encoded values encoded', () => {
    expect(legacyToRoute({ screen: 'save', goal: 'Trip to Japan:1000' })).toBe('#/save?demo&goal=Trip%20to%20Japan%3A1000');
  });
  it('leaves non-legacy URLs alone', () => {
    expect(legacyToRoute({})).toBeNull();
  });
});

describe('parseGoal', () => {
  it('parses name:target', () => {
    expect(parseGoal('Trip to Japan:1000')).toEqual({ name: 'Trip to Japan', target: 1000 });
  });
  it('rejects missing or invalid targets', () => {
    expect(parseGoal('Laptop')).toBeNull();
    expect(parseGoal('Laptop:0')).toBeNull();
  });
});
