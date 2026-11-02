"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { telHref } from "@/lib/links";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { Magnetic } from "./Magnetic";
import { Pattern } from "./Pattern";
import { navLinks } from "@/lib/nav";


export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setPastHero(y > window.innerHeight * 0.85);
      setHidden(y > last && y > 240);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      const first = el.querySelector<HTMLElement>("a");
      first?.focus();
      if (!prefersReducedMotion()) {
        const { gsap } = getGsap();
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll("[data-link]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.3 });
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal">
        Skip to content
      </a>
      <header
        data-intro-hide
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-700 ease-[var(--ease-silk)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "bg-charcoal/80 backdrop-blur-md" : "bg-transparent"}`}
      >
        <nav aria-label="Primary" className="gutter flex h-16 items-center justify-between md:h-20">
          <a href="#top" className="font-serif text-xl tracking-[0.18em] text-ivory md:text-2xl" aria-label={`${site.name}, back to top`}>
            DANA <span className="text-gold">·</span> PANI
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ivory/80 transition-colors hover:text-ivory">
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:inline-block">
              <a
                href="#reserve"
                className="inline-flex items-center gap-2 border border-gold/60 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gold transition-colors duration-500 hover:bg-gold hover:text-charcoal"
              >
                Reserve
              </a>
            </Magnetic>
            <button
              ref={toggleRef}
              type="button"
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-emerald pb-10 pt-24 lg:hidden"
      >
        <Pattern id="mnav-pattern" className="pointer-events-none absolute inset-0 opacity-[0.08]" />
        <ul className="gutter relative space-y-1">
          {navLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                data-link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-1.5 font-serif text-[2.6rem] leading-tight text-ivory"
              >
                <span className="font-sans text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="gutter relative space-y-4">
          <div className="rule-gold" />
          <div className="flex flex-wrap gap-3">
            <a href="#reserve" onClick={() => setOpen(false)} className="flex-1 bg-gold px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-charcoal">
              Reserve a table
            </a>
            <a href={telHref} className="flex-1 border border-gold/60 px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile quick actions */}
      <div
        className={`fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-full border border-gold/30 bg-charcoal/90 shadow-2xl backdrop-blur-md transition-all duration-700 ease-[var(--ease-silk)] md:hidden ${
          pastHero && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={telHref} className="flex-1 py-3.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory">
          Call
        </a>
        <a href="#reserve" className="flex-[1.6] bg-gold py-3.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.22em] text-charcoal">
          Reserve a table
        </a>
      </div>
    </>
  );
}
