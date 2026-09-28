import { describe, expect, it, vi } from 'vitest';

// boot.js reads window.location and localStorage at import time.
vi.stubGlobal('window', { location: { search: '', hash: '' }, localStorage: { getItem: () => null } });
const { parseBoot, bootScreen, parseGoal } = await import('./boot');

describe('parseBoot', () => {
  it('merges query and hash params', () => {
    expect(parseBoot('?frame=0', '#screen=home&flowers=2')).toEqual({ frame: '0', screen: 'home', flowers: '2' });
  });
  it('decodes values', () => {
    expect(parseBoot('', '#id=What%20is%20investing%3F')).toEqual({ id: 'What is investing?' });
  });
  it('ignores in-app routes', () => {
    expect(bootScreen(parseBoot('', '#/save'))).toBeNull();
  });
});

describe('bootScreen', () => {
  it('accepts known screens only', () => {
    expect(bootScreen({ screen: 'investSuccess' })).toBe('investSuccess');
    expect(bootScreen({ screen: 'welcome' })).toBe('welcome');
    expect(bootScreen({ screen: 'nope' })).toBeNull();
  });
});

describe('parseGoal', () => {
  it('parses name:target', () => {
    expect(parseGoal('Trip to Japan:1000')).toEqual({ name: 'Trip to Japan', target: 1000 });
  });
  it('rejects missing or invalid targets', () => {
    expect(parseGoal('Laptop')).toBeNull();
    expect(parseGoal('Laptop:0')).toBeNull();
    expect(parseGoal(undefined)).toBeNull();
  });
});
