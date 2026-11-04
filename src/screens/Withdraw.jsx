import { useState } from 'react';
import { motion } from 'framer-motion';
import { Garden } from '../components/Garden';
import { Button, ScreenHeader, AmountInput, Hint } from '../components/ui';
import { useApp } from '../context';
import { fmt } from '../lib/format';
import { flowersToRemove, roundMoney } from '../lib/withdraw';

/* ---- Take money out (Savings Pot or garden) ---- */
export function Withdraw({ from }) {
  const { back, navigate, savings, invested, flowers, goal, withdrawSavings, withdrawInvested } = useApp();
  const garden = from === 'garden';
  const available = roundMoney(garden ? invested : savings);
  const [amt, setAmt] = useState('');
  const n = Number(amt);
  const tooMuch = n > available;
  const valid = n > 0 && !tooMuch;
  const leaving = garden && valid ? flowersToRemove(flowers.length, n, invested) : 0;
  const goalAfter = !garden && goal && valid ? Math.min(Math.round(((available - n) / goal.target) * 100), 100) : null;

  const confirm = () => {
    if (!valid) return;
    if (garden) withdrawInvested(n); else withdrawSavings(n);
    // Replace the form in history so Back can't repeat the withdrawal.
    navigate(garden ? 'withdrawInvestDone' : 'withdrawSavingsDone', 1, { amt: n }, { replace: true });
  };

  return (
    <div className="flex h-full flex-col pb-safe" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Take money out" onBack={back} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6">
        <p className="mb-5 text-[15px]" style={{ color: 'var(--text)' }}>
          How much do you want to take out of your {garden ? 'garden' : 'Savings Pot'}?
        </p>
        <AmountInput value={amt} onChange={setAmt} presets={[20, 50, 100]} autoFocus
          label={`Amount to take out of your ${garden ? 'garden' : 'Savings Pot'}, in SGD`} />
        <div className="flex items-start justify-between gap-3">
          {tooMuch
            ? <Hint warn>That's more than you have. There's SGD {fmt(available)} in your {garden ? 'garden' : 'Savings Pot'}.</Hint>
            : <Hint>SGD {fmt(available)} in your {garden ? 'garden' : 'Savings Pot'}.</Hint>}
          <button onClick={() => setAmt(String(available))} className="mt-3 shrink-0 text-[13px] font-medium text-coral">
            Take it all
          </button>
        </div>

        {garden && (
          <div className="mt-5 rounded-2xl p-4" style={{ background: '#4CAF82' }}>
            <p className="text-[13px] text-white/90">
              {leaving === 0 ? 'Your garden stays as it is.'
                : leaving === flowers.length ? 'All your flowers will go. Your first seed stays.'
                : `${leaving} ${leaving === 1 ? 'flower' : 'flowers'} will go, newest first.`}
            </p>
            <div className="mt-3 rounded-xl bg-white/15 p-3">
              <Garden flowers={flowers} leaving={leaving} />
            </div>
          </div>
        )}
        {goalAfter !== null && (
          <Hint>Your {goal.name} goal will be at {goalAfter}%.</Hint>
        )}

        <p className="mt-5 text-[13px]" style={{ color: 'var(--subtle)' }}>
          No fees, no penalties. It's your money.
          {garden && ' Usually arrives in 1–3 working days. In this prototype it arrives straight away.'}
        </p>
      </div>
      <div className="space-y-2 px-6 pt-3">
        <Button disabled={!valid} onClick={confirm}>{valid ? `Take out SGD ${fmt(n)}` : 'Take out'}</Button>
        <Button variant="ghost" onClick={back}>Not now</Button>
      </div>
    </div>
  );
}

export function WithdrawDone({ from, amt }) {
  const { goTab, flowers } = useApp();
  const garden = from === 'garden';
  const line = !garden ? "It's there whenever you need it."
    : flowers.length === 0 ? 'Your first seed is still here whenever you\'re ready.'
    : 'Your garden keeps growing with what\'s left.';
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center" style={{ background: '#4CAF82' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-white/20">
        <span className="text-[56px]" aria-hidden="true">💸</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-6 font-serif text-[32px] font-semibold leading-tight text-white">SGD {fmt(amt || 0)} is back in your balance.</motion.h1>
      <p className="mt-3 text-[15px] text-white/85">{line}</p>
      <div className="mt-10 w-full">
        <Button variant="navy" onClick={() => goTab('home')}>Back to Home</Button>
      </div>
    </div>
  );
}
