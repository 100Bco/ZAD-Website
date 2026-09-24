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
  const duration = 2400;
  const wait = Number(el.dataset.delay ?? 0) * 1000;
  let t0: number | null = null;
  const step = (t: number) => {
    if (t0 === null) t0 = t;
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  el.textContent = 0 + suffix;
  setTimeout(() => requestAnimationFrame(step), wait);
}

/** Adds `is-visible` to `.reveal` / `[data-observe]` elements as they scroll into view. */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: HTMLElement) => {
      el.classList.add("is-visible");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => countUp(n, reduce));
    };

    const small = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    // Larger motion pieces (rings, sliding headline, dividers) wait until well inside the viewport
    const large = document.querySelectorAll<HTMLElement>("[data-observe]:not(.is-visible)");

    if (!("IntersectionObserver" in window)) {
      small.forEach(show);
      large.forEach(show);
      return;
    }

    const make = (threshold: number) =>
      new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            io.unobserve(entry.target);
          });
        },
        { threshold, rootMargin: "0px 0px -8% 0px" }
      );

    const ioSmall = make(0.15);
    const ioLarge = make(0.4);
    small.forEach((el) => ioSmall.observe(el));
    large.forEach((el) => ioLarge.observe(el));
    return () => {
      ioSmall.disconnect();
      ioLarge.disconnect();
    };
  }, [pathname]);

  return null;
}
