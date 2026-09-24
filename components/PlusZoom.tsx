"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven "zoom into the plus" transition (reference: ravextheme Adon).
 * The divider's plus pins in the middle of the screen, then the blue disc and the white plus
 * grow together until the disc covers the screen and the plus's hollow centre swallows it,
 * leaving the screen ZAD blue for the next (blue) section.
 */
export default function PlusZoom() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const st = stage.current;
    if (!el || !st) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-static");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = st.clientHeight;
      const vw = st.clientWidth;
      const travel = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / travel));

      // Exponential zoom feels steady; the last 12% of the scroll holds on full blue
      const z = Math.min(1, p / 0.88);
      const eased = z * z * (3 - 2 * z);
      const diag = Math.hypot(vw, vh);
      // End size: the plus's hollow centre (1/6 of the plus, which is 0.4 of the disc) is wider than the screen
      const endScale = (diag * 1.15 * 6) / (20 * 0.4);
      const s = Math.pow(endScale, eased);

      st.style.setProperty("--s", s.toFixed(4));
      st.style.setProperty("--line", String(Math.max(0, 1 - p / 0.04)));
      el.classList.toggle("is-covered", eased > 0.55);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={section} className="plus-zoom" aria-hidden="true">
      <div ref={stage} className="plus-zoom__stage">
        <span className="plus-zoom__line container" />
        <span className="plus-zoom__disc" />
        <span className="plus-zoom__plus">
          <i className="arm arm--t" />
          <i className="arm arm--b" />
          <i className="arm arm--l" />
          <i className="arm arm--r" />
        </span>
      </div>
    </div>
  );
}
