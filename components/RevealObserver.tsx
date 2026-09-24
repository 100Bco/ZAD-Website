"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function countUp(el: HTMLElement, reduce: boolean) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  if (reduce) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1800;
  let t0: number | null = null;
  const step = (t: number) => {
    if (t0 === null) t0 = t;
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Adds `is-visible` to `.reveal` / `[data-observe]` elements as they scroll into view. */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible), [data-observe]:not(.is-visible)");

    const show = (el: HTMLElement) => {
      el.classList.add("is-visible");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => countUp(n, reduce));
    };

    if (!("IntersectionObserver" in window)) {
      targets.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
