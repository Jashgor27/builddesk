export function formatINR(amount: number, opts: { compact?: boolean; sign?: boolean } = {}): string {
  const { compact = false, sign = false } = opts;
  const abs = Math.abs(amount);
  let body: string;
  if (compact) {
    if (abs >= 10000000) body = `₹${(abs / 10000000).toFixed(abs % 10000000 === 0 ? 0 : 2)} Cr`;
    else if (abs >= 100000) body = `₹${(abs / 100000).toFixed(abs % 100000 === 0 ? 0 : 2)} L`;
    else if (abs >= 1000) body = `₹${(abs / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}K`;
    else body = `₹${abs}`;
  } else {
    body = `₹${abs.toLocaleString('en-IN')}`;
  }
  if (sign) return `${amount < 0 ? '−' : '+'}${body}`;
  return amount < 0 ? `−${body}` : body;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatRelative(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function pct(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
