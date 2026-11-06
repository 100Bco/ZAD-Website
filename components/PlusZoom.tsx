"use client";

import { useEffect, useRef } from "react";

/** Base size of the ZAD mark on the divider, in design pixels (see --px in globals.css). */
const MARK = 32;

/**
 * Scroll-driven zoom into the ZAD mark (motion reference: ravextheme Adon).
 * The mark on the divider pins in the middle of the screen, then grows until its blue disc
 * covers the screen. The white Z fades out on the way, leaving the screen ZAD blue for the
 * next (blue) section.
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
      // End size: the disc is wider than the screen's diagonal
      const base = MARK * Math.max(1, vw / 1440);
      const endScale = (diag * 1.15) / base;
      const s = Math.pow(endScale, eased);
      // The white Z fades while the disc fills the screen
      const fade = Math.min(1, Math.max(0, (eased - 0.55) / 0.2));

      st.style.setProperty("--s", s.toFixed(4));
      st.style.setProperty("--mark", (1 - fade).toFixed(3));
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
        <span className="plus-zoom__disc">
          <svg className="plus-zoom__mark" viewBox="0 0 214.85 214.85">
            <circle cx="90.07" cy="79.16" r="5.65" />
            <polygon points="130.44 73.63 118.59 73.63 84.41 132.79 84.41 141.34 130.35 141.34 130.35 131.8 97.01 131.8 130.44 73.63" />
          </svg>
        </span>
      </div>
    </div>
  );
}
