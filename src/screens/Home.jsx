import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ActivityRow } from '../components/ActivityRow';
import { GardenTile } from '../components/Garden';
import { Sheet } from '../components/overlays';
import { IconBubble, Card } from '../components/ui';
import { useApp } from '../context';
import { fmt } from '../lib/format';

/* ---- Home ---- */
export function Home() {
  const { name, balance, invested, activity, seenAt, markSeen, goTab } = useApp();
  const [bell, setBell] = useState(false);
  const unread = activity.some((a) => a.at > seenAt);
  const closeBell = useCallback(() => { setBell(false); markSeen(); }, [markSeen]);
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
        {/* Top bar */}
        <div className="px-5 pb-6 pt-12" style={{ background: 'var(--navy)', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-blush/60">Welcome back</p>
              <p className="font-serif text-[24px] font-semibold text-blush">Hi {name} 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setBell(true)} aria-label={unread ? 'Notifications, new activity' : 'Notifications'}
                className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10">
                <span className="text-[18px]" aria-hidden="true">🔔</span>
                {unread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral" />}
              </button>
              <button onClick={() => goTab('settings')} aria-label="Profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-coral text-[15px] font-semibold text-blush">
                {name.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>

          {/* Balance card */}
          <div className="mt-5 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)' }}>
            <p className="text-[13px] text-blush/55">Your balance</p>
            <p className="num mt-1 text-[34px] font-medium text-blush">
              <span className="text-[18px] align-top text-blush/60">SGD </span>{fmt(balance)}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-leaf/20 px-2 py-0.5 text-[12px] font-medium text-leaf">
              {invested > 0 ? `🌸 SGD ${fmt(invested)} growing in your garden` : '🌱 Ready to plant your first flower'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 pt-5">
          <GardenTile onClick={() => goTab('invest')} />

          <div className="grid grid-cols-2 gap-3">
            <Card onClick={() => goTab('save')} label="Save" className="flex flex-col items-start gap-2">
              <IconBubble size={44} tone="coral">💰</IconBubble>
              <div>
                <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Save</p>
                <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Build your pot</p>
              </div>
            </Card>
            <Card onClick={() => goTab('invest')} label="Invest" className="flex flex-col items-start gap-2">
              <IconBubble size={44} tone="leaf">🌸</IconBubble>
              <div>
                <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Invest</p>
                <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Plant a flower</p>
              </div>
            </Card>
          </div>

          {activity.length > 0 && (
            <Card>
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Recent</p>
              <div className="mt-1">
                {activity.slice(0, 3).map((a, i) => (
                  <div key={a.id} style={i ? { borderTop: '1px solid var(--border)' } : undefined}><ActivityRow item={a} /></div>
                ))}
              </div>
            </Card>
          )}

          <Card onClick={() => goTab('learn')} label="Learn the basics" className="flex items-center gap-3">
            <IconBubble size={44} tone="navy">📖</IconBubble>
            <div className="flex-1">
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>Learn the basics</p>
              <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>Money basics in plain language.</p>
            </div>
            <span aria-hidden="true" style={{ color: 'var(--subtle)' }}>→</span>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {bell && (
          <Sheet title="Notifications" onClose={closeBell}>
            {activity.length === 0 ? (
              <p className="py-6 text-center text-[14px]" style={{ color: 'var(--subtle)' }}>You're all caught up. No new alerts 🎉</p>
            ) : (
              <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                {activity.slice(0, 8).map((a) => (
                  <div key={a.id} className="relative">
                    {a.at > seenAt && <span className="absolute -left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-coral" />}
                    <ActivityRow item={a} />
                  </div>
                ))}
              </div>
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}
