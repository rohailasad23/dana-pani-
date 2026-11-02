import Image from "next/image";
import type { Photo } from "@/content/site";
import { Pattern } from "./Pattern";

type Tone = "emerald" | "terracotta" | "charcoal" | "gold";

const tones: Record<Tone, { base: string; glow: string; line: string }> = {
  emerald: { base: "#123C32", glow: "rgba(198,165,107,0.45)", line: "#C6A56B" },
  terracotta: { base: "#6f3a28", glow: "rgba(245,200,140,0.5)", line: "#E6C89A" },
  charcoal: { base: "#1d1c18", glow: "rgba(198,165,107,0.35)", line: "#C6A56B" },
  gold: { base: "#8c6f3e", glow: "rgba(255,236,200,0.55)", line: "#F5F0E6" },
};

/**
 * Renders a real photograph when `photo.src` is set; otherwise an art-directed
 * decorative panel (warm light + lattice) so no fake imagery is ever shown.
 */
export function PhotoFrame({
  photo,
  tone = "emerald",
  sizes = "100vw",
  priority = false,
  className = "",
  imgClassName = "",
  patternId,
}: {
  photo: Photo;
  tone?: Tone;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  patternId: string;
}) {
  if (photo.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      </div>
    );
  }
  const t = tones[tone];
  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={photo.alt} style={{ background: t.base }}>
      <div className={`absolute inset-0 ${imgClassName}`}>
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 38%, ${t.glow}, transparent 70%)` }}
        />
        <Pattern id={patternId} className="absolute inset-0 opacity-[0.16]" color={t.line} size={72} />
        <div
          className="absolute left-1/2 top-[18%] h-[64%] w-[46%] -translate-x-1/2 arch border opacity-40"
          style={{ borderColor: t.line }}
        />
        <div
          className="absolute left-1/2 top-[24%] h-[52%] w-[34%] -translate-x-1/2 arch opacity-50"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${t.glow}, transparent 75%)` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35))" }} />
      </div>
    </div>
  );
}
