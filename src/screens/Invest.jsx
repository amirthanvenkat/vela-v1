import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Confetti } from '../components/Confetti';
import { Garden } from '../components/Garden';
import { IconBubble, Button, Card, ScreenHeader, AmountInput, Hint, ReadLink } from '../components/ui';
import { useApp } from '../context';
import { MIN_INVEST, RISKS } from '../data';
import { INSTANT } from '../lib/boot';
import { flowerView, gardenSummary, useNow } from '../lib/garden';
import { fmt } from '../lib/format';

/* ---- Invest flow ---- */
export function InvestHome() {
  const { flowers, invested, navigate } = useApp();
  const { nextBloomIn } = gardenSummary(flowers, useNow());
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
          {nextBloomIn && (
            <p className="mt-0.5 text-[12px] text-white/75">
              Next bloom in about {nextBloomIn} {nextBloomIn === 1 ? 'day' : 'days'}. New flowers grow a little each day.
            </p>
          )}
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
      <div className="space-y-3 px-5 pt-5">
        <Button onClick={() => navigate('investConfirm', 1)}>Plant a flower</Button>
        <ReadLink icon="🎢" title="Dips are normal: what to do when it goes down" onClick={() => navigate('learnArticle', 1, { id: 'dips' })} />
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
  const now = useNow();
  // The new planting starts as a seedling and blooms over the next few days.
  const newFlower = flowers.length ? flowerView(flowers[flowers.length - 1], now) : { emoji: '🌱', scale: 0.6 };
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
            {[{ emoji: '🌱', scale: 1 }, ...flowers.slice(0, -1).map((f) => flowerView(f, now))].map((v, i) => (
              <span key={i} className="inline-flex h-[42px] w-[40px] items-end justify-center"
                style={{ fontSize: 34 * v.scale, lineHeight: 1, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.2))' }}>{v.emoji}</span>
            ))}
            {/* The new planting gets a ring and a label so it stands out from the garden's first seed. */}
            <motion.span className="relative inline-flex flex-col items-center"
              initial={INSTANT ? false : { scale: 0 }} animate={{ scale: stage >= 2 ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 12, duration: 0.6 }}>
              <span className="grid h-[64px] w-[64px] place-items-center rounded-full bg-white/25 ring-2 ring-white/70"
                style={{ fontSize: 50 * Math.max(newFlower.scale, 0.8), lineHeight: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))' }}>
                {newFlower.emoji}
              </span>
              <span className="mt-1 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-leaf">Just planted</span>
            </motion.span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={INSTANT ? false : { opacity: 0, y: 16 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 16 }}
        transition={{ delay: 0.15 }}
        className="px-7 pb-safe text-center">
        <h1 className="font-serif text-[34px] font-semibold text-blush">{flowers.length === 1 ? 'Your first flower is planted.' : 'Another one planted!'}</h1>
        <p className="mx-auto mt-3 max-w-[290px] text-[15px] text-blush/75">
          SGD {fmt(amt || 50)} invested. Watch it grow and bloom over the next few days.
        </p>
        <div className="mt-7">
          <Button onClick={() => goTab('home')}>See my garden</Button>
        </div>
      </motion.div>
    </div>
  );
}
