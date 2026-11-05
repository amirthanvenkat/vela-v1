import { RISKS } from '../data';

// What a style's money is in: a two-part bar with a plain-language legend.
// `compact` drops the explanation, for small cards.
export function MixBar({ risk, compact = false }) {
  const r = RISKS[risk];
  const { shares, bonds } = r.mix;
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full" role="img"
        aria-label={`${shares}% shares, ${bonds}% bonds`}>
        <div style={{ width: `${shares}%`, background: '#FF6B6B' }} />
        <div style={{ width: `${bonds}%`, background: '#4CAF82' }} />
      </div>
      <div className="mt-2 flex justify-between text-[12px]" style={{ color: 'var(--text)' }}>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-coral" aria-hidden="true" />{shares}% shares</span>
        <span>{bonds}% bonds<span className="ml-1 inline-block h-2 w-2 rounded-full bg-leaf" aria-hidden="true" /></span>
      </div>
      {!compact && (
        <>
          <p className="mt-2 text-[13px]" style={{ color: 'var(--text)' }}>{r.mixLine}</p>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--subtle)' }}>
            Shares are slices of companies: they can grow more, and move up and down more. Bonds are loans
            to governments and companies that pay interest: steadier, and they grow more slowly.
          </p>
        </>
      )}
    </div>
  );
}
