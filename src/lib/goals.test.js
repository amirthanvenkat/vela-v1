import { describe, expect, it } from 'vitest';
import { goalSuggestion, monthsUntil, monthFromNow, formatMonth, isMonth } from './goals';

const NOW = new Date(2026, 10, 4).getTime(); // 4 Nov 2026

describe('months', () => {
  it('counts whole months to the goal month', () => {
    expect(monthsUntil('2029-11', NOW)).toBe(36);
    expect(monthsUntil('2026-12', NOW)).toBe(1);
    expect(monthsUntil('2026-10', NOW)).toBe(-1);
  });
  it('builds and formats months', () => {
    expect(monthFromNow(3, NOW)).toBe('2029-11');
    expect(formatMonth('2030-12')).toBe('Dec 2030');
  });
  it('validates YYYY-MM', () => {
    expect(isMonth('2030-12')).toBe(true);
    expect(isMonth('2030-13')).toBe(false);
    expect(isMonth(undefined)).toBe(false);
  });
});

describe('goalSuggestion', () => {
  const goal = (by, target = 10000) => ({ name: 'Flat', target, by });
  it('returns null without a goal', () => {
    expect(goalSuggestion(null, 0, NOW)).toBeNull();
  });
  it('says reached when savings cover the goal', () => {
    expect(goalSuggestion(goal('2035-01', 300), 320, NOW)).toEqual({ kind: 'reached' });
  });
  it('asks for a date when there is none', () => {
    expect(goalSuggestion(goal(undefined), 0, NOW)).toEqual({ kind: 'noDate' });
  });
  it('keeps goals under 3 years in savings', () => {
    expect(goalSuggestion(goal('2029-10'), 320, NOW)).toMatchObject({ kind: 'soon', months: 35 });
  });
  it('suggests a monthly amount for goals 3+ years away, rounded up, before growth', () => {
    // 9,680 left over 36 months = 268.9 -> 269
    expect(goalSuggestion(goal('2029-11'), 320, NOW)).toEqual({ kind: 'monthly', months: 36, left: 9680, monthly: 269 });
  });
  it('never suggests less than the minimum flower', () => {
    expect(goalSuggestion(goal('2036-11', 500), 320, NOW).monthly).toBe(10);
  });
});
