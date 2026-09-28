import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useApp } from '../context';

/* ---------- Overlays ---------- */
export function Toast({ children, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <motion.div role="status" aria-live="polite"
      initial={{ x: '-50%', y: 60, opacity: 0 }} animate={{ x: '-50%', y: 0, opacity: 1 }} exit={{ x: '-50%', y: 60, opacity: 0 }}
      className="absolute left-1/2 z-40 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px]"
      style={{ bottom: 'calc(var(--safe-bottom, 0px) + 84px)', background: 'var(--text)', color: 'var(--bg)',
               boxShadow: '0 10px 30px -8px rgba(0,0,0,.5)' }}>
      {children}
    </motion.div>
  );
}

// Rendered into the screen-level overlay layer so it sits above the bottom nav.
export function Sheet({ title, onClose, children }) {
  const { overlayEl } = useApp();
  // Captured during render, before the Close button's autoFocus moves focus into the sheet.
  const [opener] = useState(() => document.activeElement);
  // Modal: make everything behind the sheet inert, then hand focus back to the opener on close.
  useEffect(() => {
    if (!overlayEl) return;
    const behind = [...overlayEl.parentElement.children].filter((el) => el !== overlayEl);
    behind.forEach((el) => el.setAttribute('inert', ''));
    return () => {
      behind.forEach((el) => el.removeAttribute('inert'));
      if (opener && opener.focus) opener.focus();
    };
  }, [overlayEl]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!overlayEl) return null;
  return createPortal(
    <div className="pointer-events-auto absolute inset-0" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div className="absolute inset-0 bg-black/40" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="absolute bottom-0 left-0 right-0 rounded-t-3xl px-5 pt-3 pb-safe"
        style={{ background: 'var(--card)' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}>
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full" style={{ background: 'var(--border)' }} />
        <div className="mb-1 flex items-center justify-between">
          <p className="font-serif text-[20px] font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
          <button onClick={onClose} autoFocus className="rounded-full px-3 py-1.5 text-[13px] font-medium"
            style={{ background: 'var(--soft)', color: 'var(--text)' }}>Close</button>
        </div>
        {children}
      </motion.div>
    </div>,
    overlayEl,
  );
}
