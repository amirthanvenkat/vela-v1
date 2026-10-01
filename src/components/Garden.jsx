import { motion } from 'framer-motion';
import { Card } from './ui';
import { useApp } from '../context';
import { flowerView, gardenSummary, useNow } from '../lib/garden';

/* ---------- Garden ---------- */
// The permanent seed is the garden's starting point; each planting then grows from seedling to bloom.
export function Garden({ flowers, big = false }) {
  const now = useNow();
  const size = big ? 40 : 30;
  const { blooming, growing } = gardenSummary(flowers, now);
  const label = flowers.length === 0 ? 'Garden with just its first seed'
    : `Garden with ${blooming} in bloom${growing ? ` and ${growing} growing` : ''}`;
  return (
    <div className="flex min-h-[40px] flex-wrap items-end gap-1.5" role="img" aria-label={label}>
      {[{ kind: '🌱', start: true }, ...flowers].map((f, i) => {
        const v = f.start ? { emoji: '🌱', scale: 1, label: 'First seed' } : flowerView(f, now);
        return (
          <motion.span key={i} title={v.label} aria-hidden="true"
            className="inline-flex items-end justify-center"
            style={{ width: size * 1.15, height: size * 1.25, fontSize: size * v.scale, lineHeight: 1,
                     filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.18))' }}
            initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: i * 0.05 }}>
            {v.emoji}
          </motion.span>
        );
      })}
    </div>
  );
}

// "2 in bloom, 1 growing" / "3 blooms and growing."
export function gardenLine(flowers, now, empty) {
  if (flowers.length === 0) return empty;
  const { blooming, growing } = gardenSummary(flowers, now);
  if (growing === 0) return `${blooming} ${blooming === 1 ? 'bloom' : 'blooms'} and growing.`;
  return `${blooming} in bloom, ${growing} growing.`;
}

export function GardenTile({ onClick }) {
  const { flowers } = useApp();
  const now = useNow();
  return (
    <Card onClick={onClick} label="Open your garden" className="overflow-hidden" style={{ background: '#4CAF82', borderColor: 'transparent' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-[19px] font-semibold text-white">Your Garden</p>
          <p className="mt-0.5 text-[13px] text-white/85">
            {gardenLine(flowers, now, 'Plant your next flower. Start with SGD 50.')}
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-medium text-white">🌿 {flowers.length}</span>
      </div>
      <div className="mt-3 rounded-xl bg-white/15 p-3">
        <Garden flowers={flowers} />
      </div>
    </Card>
  );
}
