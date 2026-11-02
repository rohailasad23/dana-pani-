"use client";
import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Line-masked headline reveal. Pass each line as an array item;
 * lines slide up out of an overflow mask when scrolled into view.
 */
export function MaskedHeading({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const spans = el.querySelectorAll(".mask-line > span");
    const ctx = gsap.context(() => {
      gsap.from(spans, {
        yPercent: 110,
        rotate: 2,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <Tag ref={ref} className={className} id={id}>
      {lines.map((l, i) => (
        <span key={i} className={`mask-line ${lineClassName}`}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Clip-path image reveal that wipes upward, with optional subtle parallax on the inner layer. */
export function ClipReveal({
  children,
  className = "",
  parallax = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  parallax?: number;
  from?: "bottom" | "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const inner = el.querySelector<HTMLElement>("[data-inner]");
    const start =
      from === "left" ? "inset(0% 100% 0% 0%)" : from === "center" ? "inset(18% 18% 18% 18%)" : "inset(100% 0% 0% 0%)";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: start },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 88%" } },
      );
      if (inner) {
        gsap.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        if (parallax && window.innerWidth >= 768) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      }
    });
    return () => ctx.revert();
  }, [parallax, from]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div data-inner className="absolute inset-[-8%]">
        {children}
      </div>
    </div>
  );
}

/** Soft rise for small text groups (used sparingly). */
export function Rise({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y: 24,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
