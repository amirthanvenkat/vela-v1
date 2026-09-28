import { useApp } from '../context';
import { TABS } from '../routes';

/* ---------- Bottom navigation ---------- */
export const TAB_ICONS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  save: <><path d="M8 3h8M7 6h10" /><path d="M7 6a3 3 0 0 0-2 3v9a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9a3 3 0 0 0-2-3" /><path d="M10 13h4" /></>,
  invest: <><path d="M12 21v-9" /><path d="M12 12C12 8 9 5 4 5c0 4 3 7 8 7z" /><path d="M12 14c0-3 2.5-6 7-6 0 3.5-2.5 6-7 6z" /></>,
  learn: <><path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h8" /></>,
  settings: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
};

export function BottomNav() {
  const { current, goTab } = useApp();
  return (
    <nav aria-label="Main" className="absolute bottom-0 left-0 right-0 z-30"
      style={{ background: 'var(--navy)', boxShadow: '0 -8px 24px -12px rgba(0,0,0,.4)' }}>
      <div className="mx-auto grid max-w-[420px] grid-cols-5 px-2 pt-2"
        style={{ paddingBottom: 'max(8px, var(--safe-bottom, 0px))' }}>
        {TABS.map((t) => {
          const active = current.tab === t.key;
          return (
            <button key={t.key} onClick={() => goTab(t.key)} aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-1 rounded-lg py-1.5"
              style={{ color: active ? '#FF6B6B' : '#7A8899' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
                strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: active ? 'translateY(-1px)' : 'none', transition: 'transform .2s' }}>
                {TAB_ICONS[t.key]}
              </svg>
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
