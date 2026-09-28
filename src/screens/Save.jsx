import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBubble, Button, Card, ScreenHeader, AmountInput, Hint } from '../components/ui';
import { useApp } from '../context';
import { fmt } from '../lib/format';

/* ---- Save flow ---- */
export function SaveHome() {
  const { savings, goal, navigate } = useApp();
  const progress = goal ? Math.min(savings / goal.target, 1) : 0;
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Save" />
      <div className="space-y-4 px-5">
        <p className="text-[14px]" style={{ color: 'var(--subtle)' }}>Set money aside for whatever's next. You can take it out whenever you need to.</p>

        <Card className="overflow-hidden" style={{ background: '#1B2D4F', borderColor: 'transparent' }}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-blush/60">{goal ? `Saving for ${goal.name}` : 'Savings Pot'}</p>
            <IconBubble size={40} tone="glass">🫙</IconBubble>
          </div>
          <p className="num mt-2 text-[30px] font-medium text-blush">
            <span className="text-[15px] text-blush/55">SGD </span>{fmt(savings)}
          </p>
          {goal ? (
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-white/15" role="progressbar"
                aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Goal progress">
                <motion.div className="h-full rounded-full bg-coral"
                  initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
              <p className="mt-2 text-[12px] text-blush/60">
                {progress >= 1 ? `Goal reached! SGD ${fmt(goal.target)} 🎉` : `${Math.round(progress * 100)}% of SGD ${fmt(goal.target)}`}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-[12px] text-blush/55">Ready whenever you need it.</p>
          )}
        </Card>

        <Card onClick={() => navigate('setGoal', 1)} label={goal ? 'Edit goal' : 'Set a goal'}
          className="flex items-center gap-3" style={{ border: '1.5px dashed #FF6B6B' }}>
          <IconBubble size={44} tone="coral">🎯</IconBubble>
          <div className="flex-1">
            <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>{goal ? 'Edit your goal' : 'Set a Goal'}</p>
            <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>
              {goal ? `${goal.name} · SGD ${fmt(goal.target)}` : 'A trip? A rainy day? Name it and grow it.'}
            </p>
          </div>
          <span className="text-coral text-[20px]" aria-hidden="true">{goal ? '✎' : '＋'}</span>
        </Card>
      </div>
      <div className="px-5 pt-5">
        <Button onClick={() => navigate('addMoney', 1)}>Add Money</Button>
      </div>
    </div>
  );
}

export function AddMoney() {
  const { back, navigate, addToSavings, balance } = useApp();
  const [amt, setAmt] = useState('');
  const n = Number(amt);
  const tooMuch = n > balance;
  const valid = n > 0 && !tooMuch;
  const submit = () => { if (!valid) return; addToSavings(n); navigate('saveConfirm', 1, { amt: n }, { replace: true }); };
  return (
    <div className="flex h-full flex-col pb-safe" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Add Money" onBack={back} />
      <div className="flex flex-1 flex-col px-6">
        <p className="mb-5 text-[15px]" style={{ color: 'var(--text)' }}>How much do you want to save?</p>
        <AmountInput value={amt} onChange={setAmt} presets={[20, 50, 100]} autoFocus />
        {tooMuch
          ? <Hint warn>That's more than you have. You have SGD {fmt(balance)} available.</Hint>
          : <Hint>SGD {fmt(balance)} available to move.</Hint>}
      </div>
      <div className="px-6">
        <Button disabled={!valid} onClick={submit}>Save now</Button>
      </div>
    </div>
  );
}

export function SetGoal() {
  const { back, goal, setGoalTo } = useApp();
  const [goalName, setGoalName] = useState(goal ? goal.name : '');
  const [target, setTarget] = useState(goal ? String(goal.target) : '');
  const valid = goalName.trim().length > 0 && Number(target) > 0;
  const save = () => { if (!valid) return; setGoalTo({ name: goalName.trim(), target: Number(target) }); back(); };
  return (
    <div className="flex h-full flex-col pb-safe" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title={goal ? 'Edit goal' : 'Set a goal'} onBack={back} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6">
        <label className="text-[15px]" style={{ color: 'var(--text)' }} htmlFor="goal-name">What are you saving for?</label>
        <input id="goal-name" value={goalName} maxLength={28} autoFocus
          onChange={(e) => setGoalName(e.target.value)}
          placeholder="A trip to Japan"
          className="mt-3 w-full rounded-xl px-4 py-3.5 text-[17px] outline-none"
          style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }} />
        <p className="mb-3 mt-6 text-[15px]" style={{ color: 'var(--text)' }}>How much do you need?</p>
        <AmountInput value={target} onChange={setTarget} presets={[500, 1000, 2000]} label="Goal amount in SGD" />
      </div>
      <div className="space-y-2 px-6 pt-3">
        <Button disabled={!valid} onClick={save}>{goal ? 'Update goal' : 'Save goal'}</Button>
        {goal && <Button variant="ghost" onClick={() => { setGoalTo(null); back(); }}>Remove goal</Button>}
      </div>
    </div>
  );
}

export function SaveConfirm({ amt }) {
  const { goTab } = useApp();
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center" style={{ background: '#4CAF82' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-white/20">
        <span className="text-[56px]" aria-hidden="true">✅</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-6 font-serif text-[34px] font-semibold text-white">SGD {fmt(amt || 0)} saved.</motion.h1>
      <p className="mt-2 text-[15px] text-white/85">Every bit counts.</p>
      <div className="mt-10 w-full">
        <Button variant="navy" onClick={() => goTab('home')}>Back to Home</Button>
      </div>
    </div>
  );
}
