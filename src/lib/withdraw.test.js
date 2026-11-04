import { describe, expect, it } from 'vitest';
import { flowersToRemove, roundMoney } from './withdraw';

describe('flowersToRemove', () => {
  it('takes one flower per SGD 50 or part of it', () => {
    expect(flowersToRemove(5, 1, 250)).toBe(1);
    expect(flowersToRemove(5, 50, 250)).toBe(1);
    expect(flowersToRemove(5, 51, 250)).toBe(2);
    expect(flowersToRemove(5, 120, 250)).toBe(3);
  });
  it('keeps at least one flower while money stays invested', () => {
    expect(flowersToRemove(1, 50, 100)).toBe(0);
    expect(flowersToRemove(3, 149, 150)).toBe(2);
  });
  it('takes every flower when everything comes out', () => {
    expect(flowersToRemove(3, 150, 150)).toBe(3);
    expect(flowersToRemove(1, 100, 100)).toBe(1);
  });
  it('removes nothing from an empty garden or for nothing taken', () => {
    expect(flowersToRemove(0, 50, 50)).toBe(0);
    expect(flowersToRemove(3, 0, 150)).toBe(0);
  });
});

describe('roundMoney', () => {
  it('rounds to cents', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney(150 - 60.004)).toBe(90);
  });
});
