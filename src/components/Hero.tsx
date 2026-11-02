"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { photos, site } from "@/content/site";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { Magnetic } from "./Magnetic";
import { Pattern } from "./Pattern";

const INTRO_KEY = "dp-intro-played";

/** Decorative evening scene used until a real hero photograph is supplied. */
function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#141411_0%,#0f2a23_55%,#0b2620_100%)]" />
      <Pattern id="hero-scene-pattern" className="absolute inset-0 opacity-[0.07]" size={110} />
      {/* receding arches, lit from within */}
      <div className="absolute bottom-0 right-[6%] h-[78%] w-[min(46vw,620px)] max-md:right-1/2 max-md:h-[62%] max-md:w-[78vw] max-md:translate-x-1/2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="arch absolute bottom-0 left-1/2 -translate-x-1/2 border border-gold/40"
            style={{
              width: `${100 - i * 18}%`,
              height: `${100 - i * 14}%`,
              background:
                i === 3
                  ? "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(255,214,150,0.8), rgba(198,140,80,0.4) 45%, rgba(18,60,50,0.2) 80%)"
                  : "transparent",
              opacity: 1 - i * 0.12,
            }}
          />
        ))}
        <div className="absolute bottom-0 left-1/2 h-[30%] w-[160%] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(198,165,107,0.25),transparent_70%)]" />
      </div>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = getGsap();
    const html = document.documentElement;
    const skip = html.classList.contains("no-intro") || prefersReducedMotion();

    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const title = q("[data-title]")[0] as HTMLElement;
      const sheen = q("[data-sheen]")[0] as HTMLElement;
      const overlay = q("[data-overlay]")[0] as HTMLElement;
      const overlayPattern = q("[data-overlay-pattern]")[0] as HTMLElement;
      const bg = q("[data-bg]")[0] as HTMLElement;
      const reveals = q("[data-hero-reveal]");
      const header = document.querySelector("header");

      if (!skip) {
        html.classList.add("is-intro");
        window.scrollTo(0, 0);
        // Offset to place the title at the viewport centre during the intro
        const r = title.getBoundingClientRect();
        const dx = window.innerWidth / 2 - (r.left + r.width / 2);
        const dy = window.innerHeight / 2 - (r.top + r.height / 2);

        gsap.set([title, ...reveals, header], { autoAlpha: 0 });
        gsap.set(title, { x: dx, y: dy, scale: 3.2 });
        gsap.set(bg, { scale: 1.18 });
        gsap.set(overlayPattern, { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          onComplete: () => {
            html.classList.remove("is-intro");
            try {
              sessionStorage.setItem(INTRO_KEY, "1");
            } catch {}
          },
        });
        tl.to(overlayPattern, { opacity: 0.14, duration: 1, ease: "power2.out" })
          .to(title, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.15)
          .to(title, { scale: 1, duration: 1.6 }, 0.15)
          .to(sheen, { backgroundPosition: "0% 0", duration: 1.2, ease: "power2.inOut" }, 1.3)
          .to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2 }, 2.05)
          .to(title, { x: 0, y: 0, duration: 1.2 }, 2.05)
          .to(bg, { scale: 1, duration: 2.2, ease: "expo.out" }, 2.1)
          .to(reveals, { autoAlpha: 1, duration: 0.01 }, 2.6)
          .from(reveals, { y: 40, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 2.6)
          .to(header, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 2.8)
          .set(overlay, { display: "none" });
      } else {
        gsap.set(overlay, { display: "none" });
        gsap.set(sheen, { backgroundPosition: "0% 0" });
      }

      // Scroll-out: the hero gently recedes as the table section arrives
      if (!prefersReducedMotion()) {
        gsap.to(q("[data-hero-inner]"), {
          yPercent: 12,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(bg, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, el);

    return () => {
      html.classList.remove("is-intro");
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-charcoal" aria-label="Welcome to Dana Pani">
      {/* Background imagery */}
      <div data-bg className="absolute inset-0 will-change-transform">
        {photos.hero.src ? (
          <Image src={photos.hero.src} alt={photos.hero.alt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <HeroScene />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,38,32,0.9)_0%,rgba(11,38,32,0.45)_45%,rgba(11,38,32,0)_100%)] max-md:bg-[linear-gradient(180deg,rgba(11,38,32,0.6)_0%,rgba(11,38,32,0.2)_40%,rgba(11,38,32,0.92)_100%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="grain" />
        </div>
      </div>

      {/* Intro overlay (charcoal + lattice) */}
      <div data-overlay className="intro-overlay absolute inset-0 z-30 bg-charcoal" style={{ clipPath: "inset(0% 0% 0% 0%)" }} aria-hidden="true">
        <div data-overlay-pattern className="absolute inset-0">
          <Pattern id="intro-pattern" className="absolute inset-0" size={120} strokeWidth={0.7} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#171714_75%)]" />
      </div>

      {/* Composition */}
      <div data-hero-inner className="gutter relative z-40 flex h-full flex-col pb-8 pt-24 md:pb-10 md:pt-28">
        <div data-hero-reveal data-intro-hide className="flex items-start justify-between gap-6 text-ivory/70">
          <p className="eyebrow">Pakistani · Traditional Desi</p>
          <p className="eyebrow hidden text-right sm:block">
            {site.address.area}
            <br />
            {site.address.city}, {site.address.countryName}
          </p>
        </div>

        <div className="mt-auto grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-8 md:pb-6">
            <p data-hero-reveal data-intro-hide className="font-serif text-[2rem] italic leading-[1.05] text-gold-soft sm:text-4xl lg:text-5xl">
              Where Every Meal Becomes a Memory.
            </p>
            <p data-hero-reveal data-intro-hide className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ivory/75 md:text-base">
              Discover the warmth of traditional Pakistani dining, thoughtfully presented for unforgettable moments.
            </p>
            <div data-hero-reveal data-intro-hide className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Magnetic>
                <a
                  href="#menu"
                  className="group inline-flex items-center gap-3 bg-gold px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-charcoal transition-colors duration-500 hover:bg-ivory"
                >
                  Explore Our Menu
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
              <a href="#reserve" className="group relative py-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-ivory">
                Reserve Your Table
                <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100 md:scale-x-50" />
              </a>
            </div>
          </div>
        </div>

        <h1 className="relative mt-8 md:mt-4" aria-label="Dana Pani">
          <span
            data-title
            data-intro-hide
            className="block origin-center whitespace-nowrap font-serif font-medium leading-[0.82] tracking-[-0.01em] will-change-transform"
            style={{ fontSize: "clamp(4.2rem, 17.2vw, 19rem)" }}
          >
            <span data-sheen className="sheen" aria-hidden="true">
              DANA PANI
            </span>
          </span>
        </h1>

        <div data-hero-reveal data-intro-hide className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-gold/25 pt-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/60">
          <span>All-you-can-eat dining</span>
          <span className="hidden text-gold/60 sm:inline" aria-hidden="true">◆</span>
          <span>{site.priceRange}</span>
          <span className="hidden text-gold/60 sm:inline" aria-hidden="true">◆</span>
          <a href="#visit" className="hidden hover:text-gold sm:inline">
            {site.address.street}, {site.address.city}
          </a>
          <span className="ml-auto hidden items-center gap-3 md:flex" aria-hidden="true">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-ivory/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gold" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
