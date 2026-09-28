export const fmt = (n) => n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "Just now", "12 min ago", "Today, 14:05", "3 Oct"
export function when(at) {
  const diff = Date.now() - at;
  if (diff < 60e3) return 'Just now';
  if (diff < 3600e3) return `${Math.floor(diff / 60e3)} min ago`;
  const d = new Date(at);
  if (d.toDateString() === new Date().toDateString()) {
    return 'Today, ' + d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
}

// Keeps only digits and up to two decimal places.
export const cleanAmount = (raw) => {
  const [int, ...dec] = raw.replace(/[^0-9.]/g, '').split('.');
  return dec.length ? int + '.' + dec.join('').slice(0, 2) : int;
};
