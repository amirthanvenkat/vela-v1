import { motion } from 'framer-motion';
import { Card } from './ui';
import { useApp } from '../context';

/* ---------- Garden ---------- */
export function Garden({ flowers, big = false }) {
  const items = ['🌱', ...flowers]; // the seed stays as the garden's starting point
  const sz = big ? 'text-[40px]' : 'text-[30px]';
  return (
    <div className="flex flex-wrap gap-1.5" role="img" aria-label={`Garden with ${flowers.length} ${flowers.length === 1 ? 'flower' : 'flowers'}`}>
      {items.map((f, i) => (
        <motion.span key={i} className={sz} aria-hidden="true"
          initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: i * 0.05 }}
          style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.18))' }}>{f}</motion.span>
      ))}
    </div>
  );
}

export function GardenTile({ onClick }) {
  const { flowers } = useApp();
  const count = flowers.length;
  return (
    <Card onClick={onClick} label="Open your garden" className="overflow-hidden" style={{ background: '#4CAF82', borderColor: 'transparent' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-[19px] font-semibold text-white">Your Garden</p>
          <p className="mt-0.5 text-[13px] text-white/85">
            {count === 0 ? 'Plant your next flower. Start with SGD 50.' : `${count} ${count === 1 ? 'bloom' : 'blooms'} and growing.`}
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-medium text-white">🌿 {count}</span>
      </div>
      <div className="mt-3 rounded-xl bg-white/15 p-3">
        <Garden flowers={flowers} />
      </div>
    </Card>
  );
}
