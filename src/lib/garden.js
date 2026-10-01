import { useEffect, useState } from 'react';

// A planted flower grows one stage a day and is in full bloom after BLOOM_DAYS.
// Growth follows the habit (when you planted), never market prices.
const DAY = 864e5;
export const BLOOM_DAYS = 3;
export const STAGES = [
  { key: 'seedling', label: 'Seedling', emoji: '🌱', scale: 0.6 },
  { key: 'sprout', label: 'Sprout', emoji: '🌿', scale: 0.75 },
  { key: 'bud', label: 'Bud', emoji: '🌷', scale: 0.88 },
  { key: 'bloom', label: 'In bloom', emoji: null, scale: 1 }, // shows the flower's own kind
];

// 0 = seedling ... 3 = bloom
export function stageIndex(plantedAt, now) {
  const days = Math.max(0, (now - plantedAt) / DAY);
  return Math.min(STAGES.length - 1, Math.floor(days));
}

export function daysUntilBloom(plantedAt, now) {
  return Math.max(0, Math.ceil(BLOOM_DAYS - (now - plantedAt) / DAY));
}

// What to draw for one flower right now.
export function flowerView(flower, now) {
  const i = stageIndex(flower.plantedAt, now);
  const stage = STAGES[i];
  const left = daysUntilBloom(flower.plantedAt, now);
  return {
    emoji: stage.emoji || flower.kind,
    scale: stage.scale,
    bloomed: i === STAGES.length - 1,
    label: i === STAGES.length - 1 ? 'In bloom' : `${stage.label}, blooms in ${left} ${left === 1 ? 'day' : 'days'}`,
  };
}

export function gardenSummary(flowers, now) {
  const blooming = flowers.filter((f) => stageIndex(f.plantedAt, now) === STAGES.length - 1).length;
  const waits = flowers.map((f) => daysUntilBloom(f.plantedAt, now)).filter((d) => d > 0);
  return { blooming, growing: flowers.length - blooming, nextBloomIn: waits.length ? Math.min(...waits) : null };
}

// Saved gardens from before growth existed stored plain emoji: those flowers are already in bloom.
export function normalizeFlowers(saved) {
  if (!Array.isArray(saved)) return [];
  return saved
    .map((f) => (typeof f === 'string' ? { kind: f, plantedAt: 0 } : f))
    .filter((f) => f && typeof f.kind === 'string' && Number.isFinite(f.plantedAt));
}

// Demo links: `flowers=N` adds N flowers in bloom; `ages=0,1,2` adds growing ones planted that many days ago.
export function demoFlowers(kinds, count, ages, now) {
  const bloomed = Array.from({ length: count }, (_, i) => ({ kind: kinds[i % kinds.length], plantedAt: 0 }));
  const growing = ages.map((d, i) => ({ kind: kinds[(count + i) % kinds.length], plantedAt: now - d * DAY }));
  return [...bloomed, ...growing];
}

// Re-render once a minute so a flower can move to its next stage while the app stays open.
export function useNow(intervalMs = 60e3) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
