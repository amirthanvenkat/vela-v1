import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '../components/overlays';
import { IconBubble, Card, ScreenHeader } from '../components/ui';
import { useApp } from '../context';
import { RISKS, THEMES } from '../data';

/* ---- Settings ---- */
export function Settings() {
  const { theme, setTheme, name, setName, risk, navigate, resetDemo } = useApp();
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(name);
  const [toast, setToast] = useState(null);
  const [armed, setArmed] = useState(false); // "tap again to reset"
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3000); return () => clearTimeout(t); }, [armed]);
  const r = RISKS[risk];
  const saveName = () => { setName(tmp.trim() || name); setEditing(false); setToast('Name updated'); };
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
        <ScreenHeader title="You" />
        <div className="space-y-4 px-5">
          {/* Theme */}
          <Card>
            <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Theme</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Theme">
              {Object.entries(THEMES).map(([key, t]) => {
                const on = theme === key;
                return (
                  <button key={key} onClick={() => setTheme(key)} role="radio" aria-checked={on}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 transition"
                    style={{ border: on ? '2px solid #FF6B6B' : '1px solid var(--border)', background: 'var(--soft)' }}>
                    <span className="h-7 w-7 rounded-full" style={{ background: t.swatch, border: '1px solid rgba(0,0,0,.1)' }} />
                    <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Display name */}
          <Card>
            <div className="flex items-center justify-between">
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Display name</p>
              {!editing && <button onClick={() => { setTmp(name); setEditing(true); }} className="text-[13px] text-coral font-medium">Edit</button>}
            </div>
            {editing ? (
              <div className="mt-3 flex gap-2">
                <input autoFocus value={tmp} onChange={(e) => setTmp(e.target.value)} aria-label="Display name"
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-[15px] outline-none"
                  style={{ background: 'var(--soft)', color: 'var(--text)', border: '1px solid var(--border)' }} />
                <button onClick={saveName}
                  className="rounded-lg bg-coral px-4 text-[14px] font-medium text-blush">Save</button>
              </div>
            ) : (
              <p className="mt-1 text-[15px]" style={{ color: 'var(--subtle)' }}>{name}</p>
            )}
          </Card>

          {/* Risk profile */}
          <Card className="flex items-center gap-3">
            <IconBubble size={48} tone="glass">{r.emoji}</IconBubble>
            <div className="flex-1">
              <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Your money style</p>
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>{r.label} · {r.profile}</p>
            </div>
            <button onClick={() => navigate('retakeRisk', 1)} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-coral"
              style={{ border: '1px solid #FF6B6B' }}>Retake</button>
          </Card>

          {/* About */}
          <Card>
            <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>About VELA</p>
            <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: 'var(--subtle)' }}>
              Vela is a simpler way to save and invest your first salary, without the jargon or pressure.
            </p>
            <p className="mt-3 font-serif text-[15px] italic" style={{ color: '#FF6B6B' }}>"Your money, moving."</p>
            <p className="mt-2 text-[12px]" style={{ color: 'var(--subtle)' }}>Prototype · v1.1</p>
          </Card>

          {/* Reset */}
          <Card className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Reset demo</p>
              <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Start again from the welcome screen with Maya's demo money.</p>
            </div>
            <button onClick={() => (armed ? resetDemo() : setArmed(true))}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium"
              style={armed ? { background: '#FF6B6B', color: '#FFF8F5' } : { border: '1px solid var(--border)', color: 'var(--text)' }}>
              {armed ? 'Tap to confirm' : 'Reset'}
            </button>
          </Card>
        </div>
      </div>
      <AnimatePresence>
        {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
      </AnimatePresence>
    </div>
  );
}
