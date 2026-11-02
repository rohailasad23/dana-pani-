/**
 * Eight-point Mughal star lattice (girih-inspired), drawn as a repeating SVG pattern.
 */
type Props = {
  id: string;
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
};

export function Pattern({ id, className, color = "#C6A56B", size = 96, strokeWidth = 0.8 }: Props) {
  const s = size;
  const c = s / 2;
  const r = s * 0.34;
  const sq = (rot: number) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = ((i * 90 + rot) * Math.PI) / 180;
      return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`;
    });
    return pts.join(" ");
  };
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth={strokeWidth}>
            <polygon points={sq(0)} />
            <polygon points={sq(45)} />
            <circle cx={c} cy={c} r={s * 0.12} />
            <path d={`M0 0 L${s * 0.16} ${s * 0.16} M${s} 0 L${s - s * 0.16} ${s * 0.16} M0 ${s} L${s * 0.16} ${s - s * 0.16} M${s} ${s} L${s - s * 0.16} ${s - s * 0.16}`} />
            <path d={`M${c} 0 L${c} ${s * 0.1} M${c} ${s} L${c} ${s - s * 0.1} M0 ${c} L${s * 0.1} ${c} M${s} ${c} L${s - s * 0.1} ${c}`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A single ornamental rosette used as a divider / emblem. */
export function Rosette({ className, color = "#C6A56B" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1">
        <rect x="22" y="22" width="56" height="56" />
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="14" />
        <circle cx="50" cy="50" r="4" fill={color} />
      </g>
    </svg>
  );
}
