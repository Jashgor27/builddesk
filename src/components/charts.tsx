import { formatINR } from '@/lib/format';

export function DonutChart({
  data,
  size = 160,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        {total > 0 &&
          data.map((d, i) => {
            const len = (d.value / total) * circumference;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
            offset += len;
            return seg;
          })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-lg font-bold text-slate-900">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-slate-500 mt-0.5">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function BarChart({
  data,
  height = 180,
  formatValue,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * (height - 32), 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex-1 flex items-end justify-center">
              <div
                className={`w-full max-w-[44px] rounded-t-md transition-all duration-500 group-hover:opacity-80 ${d.color || 'bg-primary-500'}`}
                style={{ height: h }}
              />
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                {formatValue ? formatValue(d.value) : formatINR(d.value, { compact: true })}
              </div>
            </div>
            <span className="text-xs text-slate-500 truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 120,
  thickness = 10,
  label,
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1d66f1"
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-slate-900">{value}%</span>
        {label && <span className="text-xs text-slate-500 mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

export function LineChart({
  data,
  height = 200,
  formatValue,
}: {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return { x, y, ...d };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
  return (
    <div style={{ height }} className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d66f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1d66f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#1d66f1" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#1d66f1" vectorEffect="non-scaling-stroke" className="opacity-0 hover:opacity-100" aria-label={formatValue ? formatValue(p.value) : String(p.value)} />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-slate-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 text-sm">
          <span className="h-3 w-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-slate-600 flex-1 truncate">{item.label}</span>
          {item.value && <span className="font-semibold text-slate-900">{item.value}</span>}
        </div>
      ))}
    </div>
  );
}
