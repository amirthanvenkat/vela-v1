import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Confetti } from '../components/Confetti';
import { Garden } from '../components/Garden';
import { IconBubble, Button, Card, ScreenHeader, AmountInput, Hint } from '../components/ui';
import { useApp } from '../context';
import { MIN_INVEST, RISKS } from '../data';
import { INSTANT } from '../lib/boot';
import { fmt } from '../lib/format';

/* ---- Invest flow ---- */
export function InvestHome() {
  const { flowers, invested, navigate } = useApp();
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Invest" />
      <div className="space-y-4 px-5">
        <p className="text-[14px]" style={{ color: 'var(--subtle)' }}>Each investment plants a new flower in your garden.</p>
        <Card className="overflow-hidden" style={{ background: '#4CAF82', borderColor: 'transparent' }}>
          <div className="flex items-start justify-between">
            <p className="font-serif text-[19px] font-semibold text-white">Your Garden</p>
            {invested > 0 && <span className="num rounded-full bg-white/20 px-2.5 py-1 text-[12px] text-white">SGD {fmt(invested)}</span>}
          </div>
          <p className="mt-0.5 text-[13px] text-white/85">
            {flowers.length === 0 ? 'Still just a seed, ready to bloom.' : `${flowers.length} ${flowers.length === 1 ? 'flower' : 'flowers'} so far. Keep going!`}
          </p>
          <div className="mt-3 rounded-xl bg-white/15 p-4">
            <Garden flowers={flowers} big />
          </div>
        </Card>
        <Card onClick={() => navigate('investConfirm', 1)} label="Plant a new flower" className="flex items-center gap-3">
          <IconBubble size={44} tone="leaf">🌸</IconBubble>
          <div className="flex-1">
            <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Plant a new flower</p>
            <p className="text-[13px]" style={{ color: 'var(--subtle)' }}>From SGD {MIN_INVEST}. Take your money out whenever you want.</p>
          </div>
          <span aria-hidden="true" style={{ color: 'var(--subtle)' }}>→</span>
        </Card>
      </div>
      <div className="px-5 pt-5">
        <Button onClick={() => navigate('investConfirm', 1)}>Plant a flower</Button>
      </div>
    </div>
  );
}

export function InvestConfirm() {
  const { back, risk, balance, plantFlower, navigate } = useApp();
  const r = RISKS[risk];
  const [amt, setAmt] = useState('50');
  const n = Number(amt);
  const tooLittle = n > 0 && n < MIN_INVEST;
  const tooMuch = n > balance;
  const valid = n >= MIN_INVEST && !tooMuch;
  const confirm = () => { if (!valid) return; plantFlower(n); navigate('investSuccess', 1, { amt: n }, { replace: true }); };
  return (
    <div className="flex h-full flex-col pb-safe" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Plant a flower" onBack={back} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6">
        <p className="mb-5 text-[15px]" style={{ color: 'var(--text)' }}>How much do you want to invest?</p>
        <AmountInput value={amt} onChange={setAmt} presets={[20, 50, 100]} label="Investment amount in SGD" />
        {tooMuch ? <Hint warn>That's more than you have. You have SGD {fmt(balance)} available.</Hint>
          : tooLittle ? <Hint warn>The smallest flower is SGD {MIN_INVEST}.</Hint>
          : <Hint>SGD {fmt(balance)} available. You can take it out whenever you want.</Hint>}

        <div className="mt-6 flex w-full items-center gap-3 rounded-2xl p-3.5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <IconBubble size={46} tone="glass">{r.emoji}</IconBubble>
          <div className="text-left">
            <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Your style</p>
            <p className="font-serif text-[17px] font-semibold" style={{ color: 'var(--text)' }}>{r.label} · {r.profile}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 px-6 pt-3">
        <Button disabled={!valid} onClick={confirm}>{valid ? `Invest SGD ${fmt(n)}` : 'Invest'}</Button>
        <Button variant="ghost" onClick={back}>Not now</Button>
      </div>
    </div>
  );
}

export function InvestSuccess({ amt }) {
  const { flowers, goTab } = useApp();
  const newFlower = flowers[flowers.length - 1] || '🌸';
  const [stage, setStage] = useState(INSTANT ? 2 : 0); // 0 navy, 1 garden up, 2 bloom+confetti
  useEffect(() => {
    if (INSTANT) return;
    const t1 = setTimeout(() => setStage(1), 250);
    const t2 = setTimeout(() => setStage(2), 750);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: '#0D1B2A' }}>
      <Confetti run={stage >= 2 && !INSTANT} />

      <div className="flex flex-1 flex-col items-center justify-end px-7 pb-6">
        {/* garden rises from bottom */}
        <motion.div initial={INSTANT ? false : { y: 260, opacity: 0 }} animate={{ y: stage >= 1 ? 0 : 260, opacity: stage >= 1 ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="mb-8 w-full rounded-3xl p-6" style={{ background: '#4CAF82' }}>
          <div className="flex flex-wrap items-end gap-2" aria-hidden="true">
            {['🌱', ...flowers.slice(0, -1)].map((f, i) => (
              <span key={i} className="text-[34px]" style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.2))' }}>{f}</span>
            ))}
            <motion.span className="text-[50px]"
              initial={INSTANT ? false : { scale: 0 }} animate={{ scale: stage >= 2 ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 12, duration: 0.6 }}
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))' }}>{newFlower}</motion.span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={INSTANT ? false : { opacity: 0, y: 16 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 16 }}
        transition={{ delay: 0.15 }}
        className="px-7 pb-safe text-center">
        <h1 className="font-serif text-[34px] font-semibold text-blush">{flowers.length === 1 ? 'Your first bloom.' : 'Another bloom!'}</h1>
        <p className="mx-auto mt-3 max-w-[290px] text-[15px] text-blush/75">
          SGD {fmt(amt || 50)} invested. Your future just got a little bigger.
        </p>
        <div className="mt-7">
          <Button onClick={() => goTab('home')}>See my garden</Button>
        </div>
      </motion.div>
    </div>
  );
}
