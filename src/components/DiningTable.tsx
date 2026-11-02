"use client";
import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { Dish } from "./Dish";
import { Pattern } from "./Pattern";

type Placed = { v: Parameters<typeof Dish>[0]["variant"]; x: number; y: number; s: number; r?: number; seed?: number };

/* Positions are percentages of the (wide) table surface; s = size in vh. */
const dishes: Placed[] = [
  { v: "bread", x: 8, y: 20, s: 30, r: -12, seed: 2 },
  { v: "chutney", x: 16, y: 66, s: 16, seed: 3 },
  { v: "bowl", x: 22, y: 52, s: 22, seed: 4 },
  { v: "thaal", x: 34, y: 18, s: 50, seed: 5 },
  { v: "chai", x: 27, y: 6, s: 16, r: 20, seed: 6 },
  { v: "karahi", x: 50, y: 48, s: 44, r: 8, seed: 7 },
  { v: "salad", x: 62, y: 12, s: 28, seed: 8 },
  { v: "chutney", x: 70, y: 8, s: 15, seed: 9 },
  { v: "thaal", x: 74, y: 40, s: 46, seed: 10 },
  { v: "bread", x: 88, y: 14, s: 28, r: 24, seed: 11 },
  { v: "bowl", x: 90, y: 66, s: 22, seed: 12 },
];

const notes = [
  {
    k: "01",
    title: "The table is set.",
    body: "Every gathering begins the same way: a table laid generously, with room for everyone who walks in.",
    x: 4,
  },
  {
    k: "02",
    title: "Made to be shared.",
    body: "Desi dining has always meant passing plates, tearing bread together, and talking over one another.",
    x: 30,
  },
  {
    k: "03",
    title: "Come back for more.",
    body: "Dana Pani is an all-you-can-eat table. Nobody needs to hold back. Return as often as you like.",
    x: 56,
  },
  {
    k: "04",
    title: "Now, the menu.",
    body: "Pull up a chair. Here is what is waiting for you.",
    x: 82,
    cta: true,
  },
];

export function DiningTable() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const travel = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      // "camera" drift: a slight lift and tilt as we travel
      gsap.fromTo(
        tr.querySelector("[data-surface]"),
        { rotate: -1.5, yPercent: 2, scale: 1.04 },
        { rotate: 1, yPercent: -2, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: 1 } },
      );
      tr.querySelectorAll<HTMLElement>("[data-dish]").forEach((d) => {
        gsap.from(d, {
          scale: 0.7,
          opacity: 0,
          rotate: "-=25",
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: d, containerAnimation: travel, start: "left 95%" },
        });
      });
      tr.querySelectorAll<HTMLElement>("[data-note]").forEach((n) => {
        gsap.from(n.children, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: n, containerAnimation: travel, start: "left 80%" },
        });
      });
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-mnote]").forEach((n) => {
        gsap.from(n, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 85%" } });
      });
      el.querySelectorAll<HTMLElement>("[data-mdish]").forEach((d) => {
        gsap.from(d, { rotate: -30, scale: 0.8, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: d, start: "top 90%" } });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="table" aria-labelledby="table-heading" className="relative overflow-hidden bg-[#1b130d]">
      <h2 id="table-heading" className="sr-only">
        The Dana Pani Table
      </h2>

      {/* Desktop: a wide top-down table the camera travels across */}
      <div className="table-desktop hidden h-[100svh] md:block">
        <div ref={track} className="relative h-full w-[340vw] will-change-transform">
          <div data-surface className="absolute inset-[-6%_0] origin-center">
            {/* walnut surface */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#2a1b11_0px,#2f1f14_3px,#26180f_7px,#2c1d12_12px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_14%_40%_at_14%_45%,rgba(255,200,130,0.22),transparent),radial-gradient(ellipse_16%_45%_at_40%_45%,rgba(255,200,130,0.22),transparent),radial-gradient(ellipse_16%_45%_at_66%_50%,rgba(255,200,130,0.2),transparent),radial-gradient(ellipse_14%_40%_at_90%_45%,rgba(255,200,130,0.2),transparent)]" />
            {/* runner / dastarkhwan */}
            <div className="absolute inset-x-0 top-[34%] h-[34%] bg-emerald">
              <Pattern id="runner-pattern" className="absolute inset-0 opacity-25" size={64} />
              <div className="absolute inset-x-0 top-3 h-px bg-gold/70" />
              <div className="absolute inset-x-0 top-5 h-px bg-gold/30" />
              <div className="absolute inset-x-0 bottom-3 h-px bg-gold/70" />
              <div className="absolute inset-x-0 bottom-5 h-px bg-gold/30" />
            </div>
            {dishes.map((d, i) => (
              <div
                key={i}
                data-dish
                className="absolute"
                style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.s}vh`, height: `${d.s}vh`, transform: `rotate(${d.r ?? 0}deg)` }}
              >
                <Dish variant={d.v} seed={d.seed} className="h-full w-full" />
              </div>
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.75),transparent_18%,transparent_82%,rgba(10,8,6,0.75))]" />
          </div>

          {/* editorial notes riding on the table */}
          {notes.map((n) => (
            <div key={n.k} data-note className="absolute bottom-[7%] z-10 w-[22vw] max-w-sm bg-[#1b130d]/80 p-6 backdrop-blur-sm" style={{ left: `${n.x}%` }}>
              <p className="eyebrow text-gold">{n.k} — The Dana Pani Table</p>
              <p className="mt-3 font-serif text-4xl leading-none text-ivory lg:text-5xl">{n.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{n.body}</p>
              {n.cta && (
                <a href="#menu" className="mt-5 inline-flex items-center gap-3 border-b border-gold pb-1 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-gold">
                  Open the menu <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          ))}
          <div className="pointer-events-none absolute left-[4%] top-[9%]">
            <p className="font-serif text-[clamp(3rem,7vw,7rem)] italic leading-none text-ivory/90">The Dana Pani Table</p>
          </div>
        </div>
        <div className="grain" />
      </div>

      {/* Mobile: a vertical walk down the table */}
      <div className="relative md:hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#2a1b11_0px,#2f1f14_3px,#26180f_7px,#2c1d12_12px)]" />
        <div className="absolute inset-y-0 left-1/2 w-[46%] -translate-x-1/2 bg-emerald">
          <Pattern id="runner-pattern-m" className="absolute inset-0 opacity-25" size={56} />
          <div className="absolute inset-y-0 left-2 w-px bg-gold/60" />
          <div className="absolute inset-y-0 right-2 w-px bg-gold/60" />
        </div>
        <div className="gutter relative space-y-16 py-24">
          <p className="font-serif text-5xl italic leading-none text-ivory">The Dana Pani Table</p>
          {notes.map((n, i) => {
            const variants = ["bread", "thaal", "karahi", "salad"] as const;
            return (
              <div key={n.k} className={`flex flex-col ${i % 2 ? "items-end text-right" : "items-start"}`}>
                <div data-mdish className="h-56 w-56">
                  <Dish variant={variants[i]} seed={20 + i} className="h-full w-full" />
                </div>
                <div data-mnote className="-mt-6 max-w-[80%] bg-[#1b130d]/85 p-5 backdrop-blur-sm">
                  <p className="eyebrow text-gold">{n.k}</p>
                  <p className="mt-2 font-serif text-3xl leading-none text-ivory">{n.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">{n.body}</p>
                  {n.cta && (
                    <a href="#menu" className="mt-4 inline-flex items-center gap-2 border-b border-gold pb-1 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-gold">
                      Open the menu ↓
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
