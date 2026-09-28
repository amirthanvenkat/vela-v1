import { describe, expect, it } from 'vitest';
import { cleanAmount, fmt, when } from './format';

describe('cleanAmount', () => {
  it('keeps digits and one decimal point', () => {
    expect(cleanAmount('12a.3b')).toBe('12.3');
    expect(cleanAmount('1.2.3')).toBe('1.23');
  });
  it('caps decimals at two places', () => {
    expect(cleanAmount('9.999')).toBe('9.99');
  });
  it('returns an empty string for no digits', () => {
    expect(cleanAmount('abc')).toBe('');
  });
});

describe('fmt', () => {
  it('formats with two decimals and grouping', () => {
    expect(fmt(1240)).toBe('1,240.00');
    expect(fmt(0.5)).toBe('0.50');
  });
});

describe('when', () => {
  it('describes recent times', () => {
    expect(when(Date.now() - 10e3)).toBe('Just now');
    expect(when(Date.now() - 5 * 60e3)).toBe('5 min ago');
  });
});
