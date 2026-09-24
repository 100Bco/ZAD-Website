"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Inertial "glide" scrolling for mouse wheels and trackpads on desktop (Lenis).
 * Phones and tablets keep their native momentum scrolling; reduced-motion users keep the
 * browser's own scrolling. Scroll listeners elsewhere keep working because Lenis moves the
 * real window scroll position.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085, // lower = longer, softer glide
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -80 },
      autoRaf: true,
      // let the lightbox and menu handle their own wheel input
      prevent: (node) => !!node.closest?.(".lightbox, .menu"),
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    // pause the glide while the menu or lightbox locks the page
    const sync = () => (document.body.classList.contains("is-locked") ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    sync();

    return () => {
      mo.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  // start each new page at the top (unless the link points at a section)
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
