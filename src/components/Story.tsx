"use client";
import { useEffect, useRef } from "react";
import { photos } from "@/content/site";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { ClipReveal, MaskedHeading, Rise } from "./Reveal";
import { PhotoFrame } from "./PhotoFrame";
import { Pattern, Rosette } from "./Pattern";

const values = [
  { title: "Hospitality", body: "Guests are welcomed the way they would be in a Pakistani home: warmly, and without hurry." },
  { title: "Togetherness", body: "Long tables, shared plates and conversations that outlast the meal." },
  { title: "Pakistani food culture", body: "Traditional desi cooking, served with the generosity it was always meant to have." },
  { title: "Family dining", body: "Room for grandparents, cousins and little ones, all at the same table." },
  { title: "Memorable gatherings", body: "Birthdays, reunions, a Sunday lunch: the kind of evenings people talk about afterwards." },
];

export function Story() {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-value]").forEach((row, i) => {
        gsap.fromTo(
          row.querySelector("[data-line]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 90%", end: "top 55%", scrub: true } },
        );
        gsap.from(row.querySelector("[data-title]"), {
          xPercent: i % 2 ? 6 : -6,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 95%", end: "top 60%", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" aria-labelledby="story-heading" className="relative overflow-hidden bg-ivory text-ink">
      <Pattern id="story-pattern" className="pointer-events-none absolute inset-0 opacity-[0.07]" color="#A65E43" size={120} />
      <div className="gutter relative mx-auto max-w-[1600px] pb-24 md:pb-36">
        <div className="flex items-center gap-6 pt-6">
          <span className="rule-gold flex-1" />
          <Rosette className="h-10 w-10" />
          <span className="rule-gold flex-1" />
        </div>

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-terracotta">The Dana Pani Story</p>
            <MaskedHeading
              id="story-heading"
              className="mt-6 font-serif text-[clamp(2.9rem,6.2vw,7rem)] font-medium leading-[0.9] text-emerald"
              lines={["More Than a Meal.", <em key="a" className="text-terracotta">A Feeling of Home.</em>]}
            />
            <Rise className="mt-10 max-w-xl space-y-5 text-[1.02rem] leading-[1.8] text-ink/75">
              <p>
                In Pakistan, a meal is rarely just food. It is the reason a family gathers, the way a guest is honoured, and the place where
                the day&apos;s stories are finally told.
              </p>
              <p>
                Dana Pani is built around that feeling. A generous table, familiar flavours, and the unhurried comfort of eating together,
                here in Peoples Colony, Multan.
              </p>
            </Rise>
          </div>
          <div className="relative md:col-span-5">
            <ClipReveal className="arch aspect-[3/4] w-[78%] md:ml-auto" parallax={8}>
              <PhotoFrame photo={photos.story[0]} tone="terracotta" patternId="story-p1" sizes="(min-width:768px) 32vw, 78vw" className="h-full w-full" />
            </ClipReveal>
            <ClipReveal className="arch -mt-[30%] ml-auto aspect-[3/4] w-[52%] border-[6px] border-ivory md:-ml-[10%] md:mr-auto" parallax={14} from="center">
              <PhotoFrame photo={photos.story[1]} tone="emerald" patternId="story-p2" sizes="(min-width:768px) 20vw, 52vw" className="h-full w-full" />
            </ClipReveal>
          </div>
        </div>

        <ol ref={listRef} className="mt-24 md:mt-36" aria-label="What Dana Pani stands for">
          {values.map((v, i) => (
            <li key={v.title} data-value className="relative grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:py-10">
              <span data-line className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20" />
              <span className="font-sans text-xs tracking-[0.25em] text-gold md:col-span-1">0{i + 1}</span>
              <span data-title className="font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-none text-emerald md:col-span-6">
                {v.title}
              </span>
              <span className="max-w-md text-[0.95rem] leading-relaxed text-ink/65 md:col-span-4 md:col-start-9">{v.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
