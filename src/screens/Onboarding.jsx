import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconBubble, Button, H1 } from '../components/ui';
import { useApp } from '../context';
import { RISKS } from '../data';

/* ---- Onboarding ---- */
export function Splash() {
  const { resetTo } = useApp();
  useEffect(() => { const t = setTimeout(() => resetTo('welcome'), 2000); return () => clearTimeout(t); }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center" style={{ background: '#1B2D4F' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col items-center">
        <span className="font-serif text-[58px] font-semibold tracking-[0.14em] mr-[-0.14em] text-blush">VELA</span>
        <motion.div className="mt-2 h-[3px] rounded-full bg-coral"
          initial={{ width: 0 }} animate={{ width: 132 }} transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-5 text-[15px] text-blush/75">Your money, moving.</motion.p>
      </motion.div>
    </div>
  );
}

export function Welcome() {
  const { navigate } = useApp();
  return (
    <div className="flex h-full flex-col px-6 pb-safe pt-16" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex items-end gap-2" aria-hidden="true">
          <span className="text-[44px]">🌱</span><span className="text-[56px]">🌸</span><span className="text-[40px]">🌻</span>
        </div>
        <H1 className="text-[34px]">Investing without<br/>the headache.</H1>
        <p className="mt-4 max-w-[280px] text-[15px]" style={{ color: 'var(--subtle)' }}>
          No jargon and no pressure. Just a simpler way to start growing your money.
        </p>
      </div>
      <Button onClick={() => navigate('risk', 1)}>Get Started</Button>
    </div>
  );
}

export function RiskQuestion({ retake = false }) {
  const { navigate, back, risk, setRisk } = useApp();
  const [sel, setSel] = useState(retake ? risk : null);
  return (
    <div className="flex h-full flex-col px-6 pb-safe pt-14" style={{ background: 'var(--bg)' }}>
      {retake && (
        <button onClick={back} className="mb-3 self-start text-[14px]" style={{ color: 'var(--subtle)' }}>← Back</button>
      )}
      <H1 className="text-[28px]">What's your vibe with<br/>money right now?</H1>
      <p className="mt-2 text-[14px]" style={{ color: 'var(--subtle)' }}>Pick the one that feels like you. No wrong answers.</p>
      <div className="mt-6 flex flex-1 flex-col gap-3" role="radiogroup" aria-label="Money style">
        {Object.values(RISKS).map((r) => {
          const on = sel === r.key;
          return (
            <motion.button key={r.key} onClick={() => setSel(r.key)} animate={{ scale: on ? 1.02 : 1 }}
              role="radio" aria-checked={on}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-4 rounded-2xl p-4 text-left"
              style={{ background: 'var(--card)', border: on ? '2px solid #FF6B6B' : '1px solid var(--border)',
                       boxShadow: on ? '0 10px 26px -10px rgba(255,107,107,.5)' : '0 6px 18px -12px rgba(27,45,79,.3)' }}>
              <IconBubble size={56} tone={on ? 'coral' : 'glass'}>{r.emoji}</IconBubble>
              <div>
                <p className="font-serif text-[19px] font-semibold" style={{ color: 'var(--text)' }}>{r.label}</p>
                <p className="text-[13px]" style={{ color: 'var(--subtle)' }}>{r.vibe}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <Button disabled={!sel} onClick={() => { setRisk(sel); retake ? back() : navigate('name', 1); }}>
        This is me
      </Button>
    </div>
  );
}

export function NameInput() {
  const { navigate, name, setName } = useApp();
  const [val, setVal] = useState(name === 'Maya' ? '' : name);
  const [focus, setFocus] = useState(false);
  const submit = () => { setName(val.trim() || 'Maya'); navigate('gardenIntro', 1); };
  return (
    <div className="flex h-full flex-col px-6 pb-safe pt-20" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-1 flex-col">
        <H1 className="text-[30px]">What should we<br/>call you?</H1>
        <p className="mt-3 text-[14px]" style={{ color: 'var(--subtle)' }}>Just a first name is perfect.</p>
        <input
          autoFocus value={val} aria-label="Your first name"
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Your name"
          className="mt-8 w-full rounded-xl px-4 py-4 text-[18px] outline-none"
          style={{ background: 'var(--card)', color: 'var(--text)',
                   border: focus ? '2px solid #FF6B6B' : '1px solid var(--border)' }} />
      </div>
      <Button onClick={submit}>Let's go →</Button>
    </div>
  );
}

export function GardenIntro() {
  const { finishOnboarding } = useApp();
  return (
    <div className="flex h-full flex-col px-6 pb-safe pt-16 text-center" style={{ background: '#4CAF82' }}>
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="mb-6 grid h-28 w-28 place-items-center rounded-3xl bg-white/20">
          <span className="text-[64px]" aria-hidden="true" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.2))' }}>🌱</span>
        </motion.div>
        <h1 className="font-serif text-[34px] font-semibold text-white">Meet your garden.</h1>
        <p className="mt-4 max-w-[290px] text-[15px] leading-relaxed text-white/90">
          Every time you invest, a new flower blooms. The more you put in over time, the more your garden grows.
        </p>
      </div>
      <Button variant="navy" onClick={finishOnboarding}>Start growing</Button>
    </div>
  );
}
