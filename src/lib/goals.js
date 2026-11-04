// Goal-linked invest suggestions. Goals can carry an optional target month ("by": "YYYY-MM").
// A goal 3+ years away gets a suggested monthly amount; money needed sooner is better kept in savings,
// where it can't dip. Suggestions never count growth, so they stay on the cautious side.

export const SHORT_TERM_MONTHS = 36;
const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

export const isMonth = (by) => typeof by === 'string' && MONTH_RE.test(by);

// Whole months from now's month to the goal's month (Nov 2026 -> Nov 2029 is 36).
export function monthsUntil(by, now) {
  const [, y, m] = by.match(MONTH_RE);
  const d = new Date(now);
  return (Number(y) - d.getFullYear()) * 12 + (Number(m) - 1 - d.getMonth());
}

// 'YYYY-MM' that is `years` from now.
export function monthFromNow(years, now) {
  const d = new Date(now);
  return `${d.getFullYear() + years}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// '2030-12' -> 'Dec 2030'
export function formatMonth(by) {
  const [, y, m] = by.match(MONTH_RE);
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });
}

// What to suggest on the Invest screen for this goal, or null when there's no goal.
//   reached: the Savings Pot already covers it
//   noDate:  no target month yet, so offer to add one
//   soon:    under 3 years away, keep it in savings
//   monthly: about `monthly` SGD a month gets there, before any growth
export function goalSuggestion(goal, savings, now, minInvest = 10) {
  if (!goal) return null;
  const left = Math.max(0, goal.target - savings);
  if (left === 0) return { kind: 'reached' };
  if (!isMonth(goal.by)) return { kind: 'noDate' };
  const months = monthsUntil(goal.by, now);
  if (months < SHORT_TERM_MONTHS) return { kind: 'soon', months, left };
  return { kind: 'monthly', months, left, monthly: Math.max(minInvest, Math.ceil(left / months)) };
}
