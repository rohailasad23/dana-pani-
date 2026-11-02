/**
 * Stylised, top-down illustrations of desi table-ware (brass platters, a karahi,
 * bowls, bread, cups). Deliberately illustrative, never a claim about specific menu items.
 */
type Variant = "thaal" | "karahi" | "bowl" | "bread" | "salad" | "chai" | "chutney";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Speckle({ seed, n, r, color, size = [0.8, 2.2] }: { seed: number; n: number; r: number; color: string; size?: [number, number] }) {
  const rand = rng(seed);
  return (
    <g fill={color}>
      {Array.from({ length: n }).map((_, i) => {
        const a = rand() * Math.PI * 2;
        const d = Math.sqrt(rand()) * r;
        const s = size[0] + rand() * (size[1] - size[0]);
        return <ellipse key={i} cx={100 + Math.cos(a) * d} cy={100 + Math.sin(a) * d} rx={s} ry={s * 0.55} transform={`rotate(${rand() * 180} ${100 + Math.cos(a) * d} ${100 + Math.sin(a) * d})`} />;
      })}
    </g>
  );
}

function BrassRim({ id, r, inner }: { id: string; r: number; inner: number }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-brass`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f3dca6" />
          <stop offset="45%" stopColor="#c6a56b" />
          <stop offset="100%" stopColor="#6e5228" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r={r} fill={`url(#${id}-brass)`} />
      <circle cx="100" cy="100" r={r - 3} fill="none" stroke="#fff2cf" strokeOpacity="0.35" strokeWidth="0.8" />
      <circle cx="100" cy="100" r={inner + 2} fill="none" stroke="#5b4220" strokeOpacity="0.5" strokeWidth="1.5" />
    </>
  );
}

export function Dish({ variant, seed = 1, className = "" }: { variant: Variant; seed?: number; className?: string }) {
  const id = `dish-${variant}-${seed}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <radialGradient id={`${id}-light`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        {variant === "thaal" && (
          <>
            <BrassRim id={id} r={96} inner={80} />
            <circle cx="100" cy="100" r="80" fill="#efe4c8" />
            <Speckle seed={seed} n={420} r={74} color="#d9c391" size={[1, 2.6]} />
            <Speckle seed={seed + 3} n={140} r={70} color="#c47f3e" size={[1, 2.4]} />
            <Speckle seed={seed + 7} n={40} r={60} color="#5d7a3a" size={[0.8, 1.8]} />
            <circle cx="100" cy="100" r="80" fill={`url(#${id}-light)`} />
          </>
        )}
        {variant === "karahi" && (
          <>
            <rect x="2" y="88" width="30" height="24" rx="12" fill="#3a3530" />
            <rect x="168" y="88" width="30" height="24" rx="12" fill="#3a3530" />
            <circle cx="100" cy="100" r="80" fill="#2b2925" />
            <circle cx="100" cy="100" r="74" fill="#8f3d22" />
            <circle cx="100" cy="100" r="74" fill={`url(#${id}-sauce)`} />
            <defs>
              <radialGradient id={`${id}-sauce`} cx="45%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#d2763f" />
                <stop offset="70%" stopColor="#a4482a" />
                <stop offset="100%" stopColor="#6b2a15" />
              </radialGradient>
            </defs>
            <Speckle seed={seed} n={22} r={52} color="#c96a3a" size={[6, 12]} />
            <Speckle seed={seed + 2} n={60} r={60} color="#f0b070" size={[0.8, 2]} />
            <Speckle seed={seed + 5} n={30} r={58} color="#5f8a3b" size={[1, 2.6]} />
            <circle cx="100" cy="100" r="74" fill={`url(#${id}-light)`} />
          </>
        )}
        {variant === "bowl" && (
          <>
            <BrassRim id={id} r={70} inner={56} />
            <circle cx="100" cy="100" r="56" fill="#f2ede0" />
            <Speckle seed={seed} n={70} r={50} color="#7aa05a" size={[0.6, 1.6]} />
            <Speckle seed={seed + 1} n={20} r={44} color="#b58a52" size={[0.6, 1.2]} />
            <circle cx="100" cy="100" r="56" fill={`url(#${id}-light)`} />
          </>
        )}
        {variant === "bread" && (
          <>
            <circle cx="100" cy="100" r="90" fill="#6b4a2a" />
            <circle cx="100" cy="100" r="84" fill="none" stroke="#8a6438" strokeWidth="4" strokeDasharray="3 5" />
            {[
              [84, 92, 58],
              [118, 108, 56],
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="#e3b97a" />
                <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-light)`} />
                <g fill="#7a4a22" opacity="0.7">
                  {Array.from({ length: 14 }).map((_, j) => {
                    const a = (j * 137.5 * Math.PI) / 180;
                    const d = (j / 14) * r * 0.8;
                    return <circle key={j} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d} r={2 + (j % 3)} />;
                  })}
                </g>
              </g>
            ))}
          </>
        )}
        {variant === "salad" && (
          <>
            <circle cx="100" cy="100" r="78" fill="#ece5d4" />
            <circle cx="100" cy="100" r="72" fill="none" stroke="#c6a56b" strokeWidth="1.2" />
            {Array.from({ length: 9 }).map((_, i) => {
              const a = (i / 9) * Math.PI * 2;
              return <circle key={i} cx={100 + Math.cos(a) * 38} cy={100 + Math.sin(a) * 38} r="16" fill="none" stroke="#b5527a" strokeWidth="3" opacity="0.8" />;
            })}
            {Array.from({ length: 7 }).map((_, i) => {
              const a = (i / 7) * Math.PI * 2 + 0.4;
              return <circle key={i} cx={100 + Math.cos(a) * 18} cy={100 + Math.sin(a) * 18} r="11" fill="#d94b35" />;
            })}
            <Speckle seed={seed} n={40} r={58} color="#4f8a3a" size={[2, 5]} />
            <circle cx="100" cy="100" r="18" fill="#f3e6a0" stroke="#7aa14b" strokeWidth="3" />
          </>
        )}
        {variant === "chai" && (
          <>
            <circle cx="100" cy="100" r="62" fill="#efe7d6" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#c6a56b" strokeWidth="1.5" />
            <rect x="150" y="90" width="26" height="20" rx="10" fill="none" stroke="#efe7d6" strokeWidth="7" />
            <circle cx="100" cy="100" r="50" fill="#c89464" />
            <circle cx="100" cy="100" r="50" fill={`url(#${id}-light)`} />
            <circle cx="88" cy="88" r="10" fill="#e8c9a2" opacity="0.5" />
          </>
        )}
        {variant === "chutney" && (
          <>
            <BrassRim id={id} r={48} inner={38} />
            <circle cx="100" cy="100" r="38" fill="#4f7a33" />
            <Speckle seed={seed} n={40} r={32} color="#86b05a" size={[0.8, 2]} />
            <circle cx="100" cy="100" r="38" fill={`url(#${id}-light)`} />
          </>
        )}
      </g>
    </svg>
  );
}
