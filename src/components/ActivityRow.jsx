import { IconBubble } from './ui';
import { fmt, when } from '../lib/format';

/* ---------- Activity ---------- */
export const ACTIVITY_ICON = { deposit: '🏦', save: '💰', invest: '🌸', goal: '🎯' };

export function ActivityRow({ item }) {
  const signed = item.type === 'deposit' ? '+' : item.type === 'goal' ? '' : '−';
  return (
    <div className="flex items-center gap-3 py-2.5">
      <IconBubble size={38} tone={item.type === 'invest' ? 'leaf' : item.type === 'deposit' ? 'navy' : 'coral'}>
        {ACTIVITY_ICON[item.type] || '•'}
      </IconBubble>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium" style={{ color: 'var(--text)' }}>{item.label}</p>
        <p className="text-[12px]" style={{ color: 'var(--subtle)' }}>{when(item.at)}</p>
      </div>
      {item.type !== 'goal' && (
        <p className="num text-[14px]" style={{ color: signed === '+' ? '#4CAF82' : 'var(--text)' }}>
          {signed}SGD {fmt(item.amount)}
        </p>
      )}
    </div>
  );
}
