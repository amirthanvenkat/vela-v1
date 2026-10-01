import { cleanAmount } from '../lib/format';

/* ---------- Tiny UI primitives ---------- */

// Glassy "3D" icon bubble approximating polished glass icons.
export function IconBubble({ children, size = 64, tone = 'coral', className = '' }) {
  const tones = {
    coral: 'radial-gradient(120% 120% at 30% 25%, #ffd0c4 0%, #ff8f7e 45%, #ff5a5a 100%)',
    leaf:  'radial-gradient(120% 120% at 30% 25%, #bff0d6 0%, #6fcf9b 45%, #3fa172 100%)',
    navy:  'radial-gradient(120% 120% at 30% 25%, #8ea7d6 0%, #3f5b8f 45%, #1B2D4F 100%)',
    glass: 'radial-gradient(120% 120% at 30% 25%, rgba(255,255,255,.9) 0%, rgba(255,255,255,.35) 40%, rgba(255,255,255,.08) 100%)',
  };
  return (
    <div
      className={'relative grid shrink-0 place-items-center rounded-[28%] ' + className}
      style={{
        width: size, height: size, background: tones[tone] || tones.coral,
        boxShadow: '0 10px 24px -8px rgba(27,45,79,.45), inset 0 2px 4px rgba(255,255,255,.55), inset 0 -6px 10px rgba(0,0,0,.12)',
      }}
    >
      <div className="absolute left-[14%] top-[10%] h-[28%] w-[44%] rounded-full"
           style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0))', filter: 'blur(1px)' }} />
      <span aria-hidden="true" style={{ fontSize: size * 0.5, lineHeight: 1, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.18))' }}>{children}</span>
    </div>
  );
}

export function Button({ children, onClick, variant = 'coral', disabled = false, className = '', type = 'button' }) {
  const base = 'w-full min-h-[48px] rounded-xl font-medium text-[16px] flex items-center justify-center gap-2 transition active:scale-[.98] select-none';
  const styles = {
    coral: { className: 'text-blush shadow-[0_8px_20px_-6px_rgba(255,107,107,.6)]', style: { background: '#FF6B6B' } },
    ghost: { className: 'text-[var(--subtle)]', style: { background: 'transparent' } },
    navy:  { className: 'text-blush', style: { background: 'var(--navy)' } },
    outline:{ className: 'text-coral', style: { background: 'transparent', border: '1.5px solid #FF6B6B' } },
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={base + ' ' + styles.className + ' ' + (disabled ? 'opacity-40 pointer-events-none ' : '') + className}
      style={styles.style}>
      {children}
    </button>
  );
}

// Tappable cards behave like buttons for keyboard and screen reader users too.
export function Card({ children, className = '', style = {}, onClick, label }) {
  const interactive = onClick ? {
    role: 'button', tabIndex: 0, 'aria-label': label,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } },
  } : {};
  return (
    <div onClick={onClick} {...interactive}
      className={'rounded-2xl border p-4 ' + (onClick ? 'cursor-pointer active:scale-[.99] transition ' : '') + className}
      style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 6px 22px -10px rgba(27,45,79,.18)', ...style }}>
      {children}
    </div>
  );
}

export function H1({ children, className = '' }) {
  return <h1 className={'font-serif font-semibold leading-tight tracking-tight ' + className} style={{ color: 'var(--text)' }}>{children}</h1>;
}

export function ScreenHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-12 pb-3">
      {onBack && (
        <button onClick={onBack} aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full"
          style={{ background: 'var(--soft)', color: 'var(--text)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <h2 className="font-serif text-[26px] font-semibold" style={{ color: 'var(--text)' }}>{title}</h2>
    </div>
  );
}

// SGD amount field with preset chips (used by Save, Invest and Goals).
export function AmountInput({ value, onChange, presets = [], autoFocus = false, label = 'Amount in SGD' }) {
  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl px-4 py-4"
        style={{ background: 'var(--card)', border: '2px solid #FF6B6B' }}>
        <span className="num text-[22px]" style={{ color: 'var(--subtle)' }}>SGD</span>
        <input inputMode="decimal" autoFocus={autoFocus} value={value} aria-label={label}
          onChange={(e) => onChange(cleanAmount(e.target.value))}
          placeholder="0.00"
          className="num w-full min-w-0 bg-transparent text-[28px] outline-none"
          style={{ color: 'var(--text)' }} />
      </div>
      {presets.length > 0 && (
        <div className="mt-4 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${presets.length}, minmax(0, 1fr))` }}>
          {presets.map((p) => {
            const on = Number(value) === p;
            return (
              <button key={p} onClick={() => onChange(String(p))} aria-pressed={on}
                className="num rounded-xl py-3 text-[15px] font-medium transition active:scale-95"
                style={{ background: on ? '#FF6B6B' : 'var(--card)', color: on ? '#FFF8F5' : 'var(--text)',
                         border: '1px solid var(--border)' }}>
                SGD {p.toLocaleString('en-SG')}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Hint({ children, warn = false }) {
  return (
    <p className="mt-3 text-[13px]" role={warn ? 'alert' : undefined}
      style={{ color: warn ? '#FF6B6B' : 'var(--subtle)' }}>{children}</p>
  );
}

// A small "related read" link to a Learn article, shown on the screen where the topic comes up.
export function ReadLink({ icon, title, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left"
      style={{ background: 'var(--soft)', color: 'var(--text)' }}>
      <span aria-hidden="true" className="text-[18px]">{icon}</span>
      <span className="flex-1 text-[13px]"><span style={{ color: 'var(--subtle)' }}>Read: </span>{title}</span>
      <span aria-hidden="true" style={{ color: 'var(--subtle)' }}>→</span>
    </button>
  );
}
