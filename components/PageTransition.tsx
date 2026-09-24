"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "cover" | "covered" | "reveal";

const COVER_MS = 750;
const REVEAL_MS = 700;

/**
 * Page change as a spreading ripple: clicking an internal link grows a ZAD-blue circle
 * from the pointer until it fills the screen, the next page loads underneath, then the
 * blue layer softly clears.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const target = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.classList.contains("card__media")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (or #section link)

      e.preventDefault();
      target.current = url.pathname + url.search + url.hash;
      setOrigin({ x: `${e.clientX}px`, y: `${e.clientY}px` });
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("cover")));
      timers.current.push(
        setTimeout(() => {
          setPhase("covered");
          router.push(target.current as string);
        }, COVER_MS)
      );
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      timers.current.forEach(clearTimeout);
    };
  }, [router]);

  // safety net: never leave the screen blue if the navigation stalls
  useEffect(() => {
    if (phase !== "covered") return;
    const t = setTimeout(() => setPhase("reveal"), 4000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setPhase("idle"), REVEAL_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // the new page is in: clear the blue layer
  useEffect(() => {
    if (phase !== "covered") return;
    const t = setTimeout(() => setPhase("reveal"), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={`page-ripple page-ripple--${phase}`}
      style={{ ["--rx" as string]: origin.x, ["--ry" as string]: origin.y }}
      aria-hidden="true"
    />
  );
}
