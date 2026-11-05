import { RISKS } from '../data';

// "60% shares and 40% bonds"
export function mixText(key) {
  const { shares, bonds } = RISKS[key].mix;
  return `${shares}% shares and ${bonds}% bonds`;
}

// What changes when someone switches style, or null when they keep the same one.
export function styleChange(fromKey, toKey) {
  if (!RISKS[fromKey] || !RISKS[toKey] || fromKey === toKey) return null;
  const from = RISKS[fromKey].mix, to = RISKS[toKey].mix;
  return {
    from: RISKS[fromKey], to: RISKS[toKey],
    text: `Your mix moves from ${from.shares}% shares and ${from.bonds}% bonds to ${to.shares}% shares and ${to.bonds}% bonds.`,
    bolder: to.shares > from.shares,
  };
}
