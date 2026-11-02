"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { menu, menuCategories, site, type MenuCategory, type MenuItem } from "@/content/site";
import { telHref } from "@/lib/links";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { MaskedHeading } from "./Reveal";
import { PhotoFrame } from "./PhotoFrame";

type Filter = "All" | MenuCategory;
const filters: Filter[] = ["All", ...menuCategories];
const tones = ["emerald", "terracotta", "charcoal", "gold"] as const;

const formatPrice = (p: number | null) => (p == null ? "Price on request" : `Rs. ${p.toLocaleString("en-PK")}`);

export function Menu() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState(0);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  const items = useMemo(() => (filter === "All" ? menu : menu.filter((m) => m.category === filter)), [filter]);
  const grouped = useMemo(() => {
    const cats = filter === "All" ? menuCategories : [filter];
    return cats
      .map((c) => ({ category: c, items: items.filter((i) => i.category === c) }))
      .filter((g) => g.items.length);
  }, [filter, items]);
  const hasPlaceholders = menu.some((m) => m.placeholder);
  const current: MenuItem | undefined = items[active] ?? items[0];

  // Sliding tab indicator
  useEffect(() => {
    const wrap = tabs.current;
    const ind = indicator.current;
    if (!wrap || !ind) return;
    const btn = wrap.querySelector<HTMLButtonElement>(`[data-filter="${CSS.escape(filter)}"]`);
    if (!btn) return;
    const place = () => {
      ind.style.width = `${btn.offsetWidth}px`;
      ind.style.transform = `translateX(${btn.offsetLeft}px)`;
    };
    place();
    wrap.scrollTo({
      left: btn.offsetLeft - wrap.clientWidth / 2 + btn.offsetWidth / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter]);

  // Category transition
  useEffect(() => {
    if (!list.current || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    gsap.fromTo(
      list.current.querySelectorAll("[data-row], [data-group]"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.03 },
    );
  }, [filter]);

  // Preview swap
  useEffect(() => {
    if (!preview.current || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    gsap.fromTo(preview.current, { clipPath: "inset(0 0 100% 0)", scale: 1.06 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 0.9, ease: "expo.out" });
  }, [active, filter]);

  let runningIndex = -1;

  return (
    <section id="menu" aria-labelledby="menu-heading" className="relative bg-ivory text-ink">
      <div className="gutter mx-auto max-w-[1600px] py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-terracotta">The Menu Book</p>
            <MaskedHeading
              id="menu-heading"
              className="mt-5 font-serif text-[clamp(3rem,8vw,8.5rem)] font-medium leading-[0.88] text-emerald"
              lines={["A Table of", <em key="m" className="text-terracotta">Many Flavours</em>]}
            />
          </div>
          <div className="text-[0.95rem] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
            <p>
              Traditional Pakistani cooking, laid out course by course. Choose a chapter below, or browse the whole book.
            </p>
            {hasPlaceholders && (
              <p className="mt-4 border-l-2 border-gold pl-4 text-sm text-ink/60">
                Our full menu and prices are being added. For today&apos;s selection, call us on{" "}
                <a href={telHref} className="font-semibold text-emerald underline decoration-gold underline-offset-4">
                  {site.phone.display}
                </a>
                .
              </p>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="sticky top-0 z-20 -mx-[var(--gutter)] mt-14 bg-ivory/95 px-[var(--gutter)] backdrop-blur md:top-0">
          <div ref={tabs} role="tablist" aria-label="Menu categories" className="no-scrollbar relative flex gap-7 overflow-x-auto border-b border-ink/15 md:gap-10">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                data-filter={f}
                aria-selected={filter === f}
                aria-controls="menu-panel"
                onClick={() => {
                  setFilter(f);
                  setActive(0);
                  setOpenRow(null);
                }}
                className={`shrink-0 py-5 text-[0.72rem] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
                  filter === f ? "text-emerald" : "text-ink/45 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
            <span ref={indicator} aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] bg-terracotta transition-[transform,width] duration-500 ease-[var(--ease-silk)]" />
          </div>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          {/* Sticky preview (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden arch">
                <div ref={preview} className="absolute inset-0">
                  {current && (
                    <PhotoFrame
                      photo={current.image ?? { src: null, alt: current.name }}
                      tone={tones[Math.max(0, menuCategories.indexOf(current.category)) % tones.length]}
                      patternId="menu-preview-pattern"
                      sizes="40vw"
                      className="h-full w-full"
                    />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 border border-gold/40 arch" />
              </div>
              {current && (
                <div className="mt-6 flex items-baseline justify-between gap-6">
                  <p className="font-serif text-2xl text-emerald">{current.name}</p>
                  <p className="eyebrow shrink-0 text-terracotta">{current.category}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dish list */}
          <div id="menu-panel" role="tabpanel" ref={list} className="md:col-span-7" aria-live="polite">
            {grouped.map((g) => (
              <div key={g.category} className="mb-14 last:mb-0">
                <div data-group className="mb-4 flex items-center gap-4">
                  <h3 className="font-serif text-3xl italic text-terracotta md:text-4xl">{g.category}</h3>
                  <span className="rule-gold flex-1" />
                </div>
                <ul>
                  {g.items.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const open = openRow === idx;
                    return (
                      <li key={`${item.category}-${item.name}`} data-row>
                        <button
                          type="button"
                          data-cursor="Taste"
                          aria-expanded={open}
                          onMouseEnter={() => setActive(idx)}
                          onFocus={() => setActive(idx)}
                          onMouseMove={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                            e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                          }}
                          onClick={() => {
                            setActive(idx);
                            setOpenRow(open ? null : idx);
                          }}
                          className={`menu-row group relative block w-full border-b border-ink/10 py-6 text-left ${open ? "is-open" : ""}`}
                        >
                          <span className="relative flex items-baseline gap-4">
                            <span className="w-8 shrink-0 font-sans text-xs tracking-[0.2em] text-gold">{String(idx + 1).padStart(2, "0")}</span>
                            <span className="font-serif text-[1.55rem] leading-tight text-emerald transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-[2rem]">
                              {item.name}
                            </span>
                            <span aria-hidden="true" className="mx-2 hidden flex-1 translate-y-[-0.3em] border-b border-dotted border-ink/25 sm:block" />
                            <span className="ml-auto shrink-0 text-right text-sm font-semibold text-terracotta sm:ml-0">{formatPrice(item.price)}</span>
                          </span>
                          <span
                            className={`relative mt-2 block pl-12 text-[0.92rem] leading-relaxed transition-all duration-500 ease-[var(--ease-silk)] ${
                              open ? "text-ink/80" : "text-ink/50 group-hover:text-ink/80"
                            }`}
                          >
                            {item.description}
                          </span>
                        </button>
                          {/* Mobile tap preview */}
                          <div className={`relative grid pl-12 transition-[grid-template-rows,margin] duration-500 md:hidden ${open ? "mb-6 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                              <PhotoFrame
                                photo={item.image ?? { src: null, alt: item.name }}
                                tone={tones[menuCategories.indexOf(item.category) % tones.length]}
                                patternId={`menu-m-${idx}`}
                                sizes="90vw"
                                className="aspect-[16/10] w-full"
                              />
                            </div>
                          </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
