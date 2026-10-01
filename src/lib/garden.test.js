import { describe, expect, it } from 'vitest';
import { stageIndex, daysUntilBloom, flowerView, gardenSummary, normalizeFlowers, demoFlowers } from './garden';

const DAY = 864e5;
const NOW = 1_800_000_000_000;

describe('stageIndex / daysUntilBloom', () => {
  it('moves one stage a day and blooms on day 3', () => {
    expect([0, 0.5, 1, 2.2, 3, 40].map((d) => stageIndex(NOW - d * DAY, NOW))).toEqual([0, 0, 1, 2, 3, 3]);
    expect([0, 0.5, 2.2, 3].map((d) => daysUntilBloom(NOW - d * DAY, NOW))).toEqual([3, 3, 1, 0]);
  });
  it('treats a clock that runs backwards as just planted', () => {
    expect(stageIndex(NOW + DAY, NOW)).toBe(0);
  });
});

describe('flowerView', () => {
  it('shows growth stages, then the flower itself', () => {
    expect(flowerView({ kind: '🌻', plantedAt: NOW }, NOW)).toMatchObject({ emoji: '🌱', bloomed: false, label: 'Seedling, blooms in 3 days' });
    expect(flowerView({ kind: '🌻', plantedAt: NOW - 2.5 * DAY }, NOW)).toMatchObject({ emoji: '🌷', label: 'Bud, blooms in 1 day' });
    expect(flowerView({ kind: '🌻', plantedAt: 0 }, NOW)).toMatchObject({ emoji: '🌻', bloomed: true, scale: 1, label: 'In bloom' });
  });
});

describe('gardenSummary', () => {
  it('counts blooms and growing flowers and finds the next bloom', () => {
    const flowers = [{ kind: '🌸', plantedAt: 0 }, { kind: '🌺', plantedAt: NOW - 1.5 * DAY }, { kind: '🌻', plantedAt: NOW }];
    expect(gardenSummary(flowers, NOW)).toEqual({ blooming: 1, growing: 2, nextBloomIn: 2 });
    expect(gardenSummary([], NOW)).toEqual({ blooming: 0, growing: 0, nextBloomIn: null });
  });
});

describe('normalizeFlowers', () => {
  it('migrates old emoji-only gardens as already in bloom', () => {
    expect(normalizeFlowers(['🌸', { kind: '🌺', plantedAt: 5 }])).toEqual([{ kind: '🌸', plantedAt: 0 }, { kind: '🌺', plantedAt: 5 }]);
  });
  it('drops anything malformed', () => {
    expect(normalizeFlowers([null, { kind: '🌸' }, 3])).toEqual([]);
    expect(normalizeFlowers(undefined)).toEqual([]);
  });
});

describe('demoFlowers', () => {
  it('adds bloomed flowers then growing ones of the given ages', () => {
    const f = demoFlowers(['a', 'b', 'c'], 2, [0, 1], NOW);
    expect(f.map((x) => x.kind)).toEqual(['a', 'b', 'c', 'a']);
    expect(f.map((x) => stageIndex(x.plantedAt, NOW))).toEqual([3, 3, 0, 1]);
  });
});
