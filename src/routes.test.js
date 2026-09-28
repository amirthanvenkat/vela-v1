import { describe, expect, it } from 'vitest';
import { SCREEN_PATHS, pathFor, screenFromPath } from './routes';

describe('pathFor', () => {
  it('builds plain, param and query paths', () => {
    expect(pathFor('home')).toBe('/home');
    expect(pathFor('learnArticle', { id: 'risk' })).toBe('/learn/risk');
    expect(pathFor('saveConfirm', { amt: 40 })).toBe('/save/done?amt=40');
  });
  it('falls back to home for unknown screens', () => {
    expect(pathFor('nope')).toBe('/home');
  });
});

describe('screenFromPath', () => {
  it('finds the screen and its params', () => {
    expect(screenFromPath('/learn/money')).toEqual({ screen: 'learnArticle', params: { id: 'money' } });
    expect(screenFromPath('/invest/done')).toEqual({ screen: 'investSuccess', params: {} });
    expect(screenFromPath('/')).toEqual({ screen: 'splash', params: {} });
  });
  it('returns null for unknown paths', () => {
    expect(screenFromPath('/nope')).toBeNull();
  });
  it('round-trips every screen', () => {
    for (const screen of Object.keys(SCREEN_PATHS)) {
      const path = pathFor(screen, { id: 'investing' });
      expect(screenFromPath(path).screen).toBe(screen);
    }
  });
});
