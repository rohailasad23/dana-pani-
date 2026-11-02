"use client";
import { useEffect, useRef } from "react";
import { photos } from "@/content/site";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { ClipReveal, MaskedHeading } from "./Reveal";
import { PhotoFrame } from "./PhotoFrame";

const layout = [
  "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto md:h-full",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-3 md:col-start-9 aspect-[3/4]",
  "md:col-span-4 md:col-start-2 aspect-square md:mt-10",
  "md:col-span-6 md:col-start-7 aspect-[16/10] md:mt-28",
];
const tones = ["charcoal", "terracotta", "emerald", "gold", "charcoal"] as const;

export function Ambiance() {
  const wide = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wide.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 12% 14% 12%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 15%", scrub: true } },
      );
      gsap.fromTo(el.querySelector("[data-wide-inner]"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="ambiance" aria-labelledby="ambiance-heading" className="relative bg-charcoal py-24 text-ivory md:py-36">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-gold">Ambiance</p>
            <MaskedHeading
              id="ambiance-heading"
              className="mt-5 font-serif text-[clamp(3rem,7.5vw,8rem)] font-medium leading-[0.9]"
              lines={["An Evening", <em key="b" className="text-gold">at Dana Pani</em>]}
            />
          </div>
          <p className="text-[0.95rem] leading-relaxed text-ivory/65 md:col-span-3 md:col-start-10">
            Warm light, a generous table and the hum of conversation. A glimpse of what an evening here feels like.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:mt-24 md:grid-cols-12 md:gap-6">
          {photos.ambiance.map((p, i) => (
            <figure key={i} className={`group relative ${layout[i]}`} data-cursor="View">
              <ClipReveal className="h-full w-full" parallax={i % 2 ? 6 : 10} from={i % 2 ? "left" : "bottom"}>
                <PhotoFrame
                  photo={p}
                  tone={tones[i]}
                  patternId={`amb-${i}`}
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-105"
                />
              </ClipReveal>
              <figcaption className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/85">
                <span className="text-gold">0{i + 1}</span> {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div ref={wide} className="relative mt-24 h-[70svh] overflow-hidden md:mt-36 md:h-[92svh]">
        <div data-wide-inner className="absolute inset-0">
          <PhotoFrame photo={photos.ambianceWide} tone="emerald" patternId="amb-wide" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,20,0.2),rgba(23,23,20,0.75))]" />
        <p className="gutter absolute bottom-10 left-0 max-w-3xl font-serif text-[clamp(2rem,4.5vw,4.5rem)] italic leading-[1.02] text-ivory md:bottom-16">
          Good food tastes better in good company.
        </p>
      </div>
    </section>
  );
}
