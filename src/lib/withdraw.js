// Taking money out. Flowers don't record their own amount, so the garden follows the amount
// taken out: one flower per SGD 50 (or part of it), newest first.
export const SGD_PER_FLOWER = 50;

// Round to cents so repeated withdrawals don't drift (0.1 + 0.2 and friends).
export const roundMoney = (x) => Math.round(x * 100) / 100;

// How many flowers leave when `amount` comes out of `invested`. While money stays invested the
// garden keeps at least one flower; taking everything out takes every flower.
export function flowersToRemove(flowerCount, amount, invested) {
  if (flowerCount <= 0 || amount <= 0) return 0;
  const n = Math.min(Math.ceil(amount / SGD_PER_FLOWER), flowerCount);
  const allOut = roundMoney(invested - amount) <= 0;
  return allOut ? flowerCount : Math.min(n, flowerCount - 1);
}
