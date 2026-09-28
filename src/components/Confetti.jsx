import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ---------- Confetti ---------- */
export function Confetti({ run }) {
  const reduced = useReducedMotion();
  const pieces = useMemo(() => Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    x: (Math.random() * 2 - 1) * 150,
    rot: Math.random() * 540 - 270,
    delay: Math.random() * 0.25,
    color: Math.random() > 0.5 ? '#FF6B6B' : '#4CAF82',
    size: 7 + Math.random() * 8,
    round: Math.random() > 0.5,
  })), []);
  if (!run || reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" data-testid="confetti">
      {pieces.map((p) => (
        <motion.div key={p.id}
          className="absolute left-1/2 top-[38%]"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: 360, opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: p.round ? '50%' : '2px' }} />
      ))}
    </div>
  );
}
