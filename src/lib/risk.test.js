import { describe, expect, it } from 'vitest';
import { RISKS } from '../data';
import { mixText, styleChange } from './risk';

describe('style mixes', () => {
  it('always add up to 100%', () => {
    for (const r of Object.values(RISKS)) expect(r.mix.shares + r.mix.bonds).toBe(100);
  });
  it('get bolder from Tortoise to Rocket', () => {
    expect(RISKS.tortoise.mix.shares).toBeLessThan(RISKS.fox.mix.shares);
    expect(RISKS.fox.mix.shares).toBeLessThan(RISKS.rocket.mix.shares);
  });
  it('read in plain words', () => {
    expect(mixText('fox')).toBe('60% shares and 40% bonds');
  });
});

describe('styleChange', () => {
  it('describes a switch and its direction', () => {
    const c = styleChange('fox', 'rocket');
    expect(c.text).toBe('Your mix moves from 60% shares and 40% bonds to 90% shares and 10% bonds.');
    expect(c.bolder).toBe(true);
    expect(styleChange('fox', 'tortoise').bolder).toBe(false);
  });
  it('is null when nothing changes', () => {
    expect(styleChange('fox', 'fox')).toBeNull();
    expect(styleChange('fox', 'nope')).toBeNull();
  });
});
