"use client";
import { useEffect, useRef } from "react";
import { getGsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Desktop-only cursor: a gold dot plus a trailing ring.
 * Elements with data-cursor="Label" expand the ring and show the label.
 * Links/buttons get a softer hover state.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const d = dot.current!;
    const r = ring.current!;
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, select, input, textarea, label");
      if (labelled) {
        r.classList.add("is-active");
        r.classList.remove("is-hover");
        if (label.current) label.current.textContent = labelled.dataset.cursor || "";
      } else if (interactive) {
        r.classList.add("is-hover");
        r.classList.remove("is-active");
      } else {
        r.classList.remove("is-active", "is-hover");
      }
    };
    const leaveWindow = () => {
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };
    const enterWindow = () => {
      gsap.to([d, r], { opacity: 1, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    document.documentElement.addEventListener("pointerenter", enterWindow);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      document.documentElement.removeEventListener("pointerenter", enterWindow);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
