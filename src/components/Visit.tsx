"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { directionsHref, fullAddress, mapsEmbedSrc, telHref, whatsappHref } from "@/lib/links";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { MaskedHeading, Rise } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { Pattern } from "./Pattern";

export function Visit() {
  const frame = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);

  // Only load the Google Map when it approaches the viewport (Core Web Vitals)
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Transition: an emerald curtain lifts as the section arrives, revealing the ivory map room
  useEffect(() => {
    const c = curtain.current;
    if (!c || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        c,
        { clipPath: "ellipse(120% 100% at 50% 0%)" },
        { clipPath: "ellipse(120% 0% at 50% 0%)", ease: "none", scrollTrigger: { trigger: c.parentElement, start: "top 85%", end: "top 15%", scrub: true } },
      );
      gsap.fromTo(
        frame.current,
        { clipPath: "inset(20% 20% 0% 20% round 999px 999px 0 0)" },
        { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", ease: "none", scrollTrigger: { trigger: frame.current, start: "top 95%", end: "top 35%", scrub: true } },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="visit" aria-labelledby="visit-heading" className="relative overflow-hidden bg-ivory text-ink">
      <div ref={curtain} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40vh] bg-emerald-deep" style={{ clipPath: "ellipse(120% 0% at 50% 0%)" }} />
      <div className="gutter relative mx-auto max-w-[1600px] py-24 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="eyebrow text-terracotta">Location</p>
            <MaskedHeading
              id="visit-heading"
              className="mt-6 font-serif text-[clamp(2.9rem,5.2vw,6rem)] font-medium leading-[0.92] text-emerald"
              lines={["Find Your Way", <em key="e" className="text-terracotta">to Great Taste.</em>]}
            />
            <Rise className="mt-10 space-y-6">
              <address className="not-italic">
                <p className="font-serif text-3xl text-emerald">{site.name}</p>
                <p className="mt-2 leading-relaxed text-ink/70">
                  {site.address.street}, {site.address.area}
                  <br />
                  {site.address.city}, {site.address.countryName}
                  <br />
                  <span className="text-sm text-ink/50">Plus code {site.address.plusCode}</span>
                </p>
              </address>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-emerald px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors duration-500 hover:bg-terracotta">
                    Get directions
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">↗</span>
                  </a>
                </Magnetic>
                <a href={telHref} className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald underline decoration-gold underline-offset-[6px]">
                  {site.phone.display}
                </a>
              </div>
            </Rise>
          </div>

          <div className="md:col-span-7">
            <div ref={frame} className="map-tint relative aspect-[4/5] overflow-hidden rounded-t-full bg-emerald/10 sm:aspect-[5/4] md:aspect-[6/5]" style={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" }}>
              {loadMap ? (
                <iframe
                  title={`Map showing ${site.name}, ${fullAddress}`}
                  src={mapsEmbedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-ink/50">Loading map…</div>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-inset ring-gold/60" />
              <div className="pointer-events-none absolute inset-3 rounded-t-full border border-gold/40" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="mt-28 md:mt-40" aria-labelledby="contact-heading">
          <div className="flex items-center gap-6">
            <h2 id="contact-heading" className="eyebrow shrink-0 text-terracotta">
              Contact
            </h2>
            <span className="rule-gold flex-1" />
          </div>
          <div className="mt-10 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-sm text-ink/55">Call the restaurant</p>
              <a href={telHref} data-cursor="Call" className="group mt-2 inline-block font-serif text-[clamp(2.8rem,8vw,7.5rem)] leading-none text-emerald">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-silk)] group-hover:bg-[length:100%_2px]">
                  {site.phone.display}
                </span>
              </a>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#reserve" className="bg-emerald px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-terracotta">
                  Reserve a table
                </a>
                {site.whatsapp.enabled && (
                  <a href={whatsappHref("Assalam-o-Alaikum Dana Pani,")} target="_blank" rel="noopener noreferrer" className="border border-emerald px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald transition-colors hover:bg-emerald hover:text-ivory">
                    WhatsApp us
                  </a>
                )}
              </div>
            </div>
            <dl className="grid gap-8 text-[0.95rem] sm:grid-cols-2 md:col-span-5 md:grid-cols-1">
              <div>
                <dt className="eyebrow text-gold">Opening hours</dt>
                <dd className="mt-3 leading-relaxed text-ink/75">
                  {site.hours ? (
                    <ul>
                      {site.hours.map((h) => (
                        <li key={h.days} className="flex justify-between gap-6 border-b border-ink/10 py-1.5">
                          <span>{h.days}</span>
                          <span>{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>Please call ahead to check today&apos;s timings.</>
                  )}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-gold">Find us</dt>
                <dd className="mt-3 leading-relaxed text-ink/75">
                  <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">
                    {site.address.street}, {site.address.area}, {site.address.city}
                  </a>
                </dd>
              </div>
              {site.socials.length > 0 && (
                <div>
                  <dt className="eyebrow text-gold">Follow</dt>
                  <dd className="mt-3 flex flex-wrap gap-5">
                    {site.socials.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink/75 underline decoration-gold/50 underline-offset-4 hover:text-emerald">
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
      <Pattern id="visit-pattern" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.08]" color="#123C32" size={80} />
    </section>
  );
}
