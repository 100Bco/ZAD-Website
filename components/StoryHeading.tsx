"use client";

import { useEffect, useRef } from "react";

type Props = { line1: string; line2Image: string; line2Alt: string };

const START = 1; // heading top at the bottom edge of the screen
const END = 0.3; // ...fully in place once it reaches 30% from the top
const SMOOTH = 0.06; // share of the remaining distance covered each frame (lower = softer)

const clamp = (v: number) => Math.min(1, Math.max(0, v));
// gentle start and finish, so the lines travel evenly across the whole scroll range
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

/**
 * "Câu chuyện" slides in from the left and "Chúng tôi viết" from the right, driven by scroll
 * position (not a timer) and eased towards the target each frame so the motion stays soft.
 */
export default function StoryHeading({ line1, line2Image, line2Alt }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--a", "1");
      el.style.setProperty("--b", "1");
      return;
    }

    let current = 0;
    let frame = 0;

    const target = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh * START - rect.top) / (vh * (START - END)));
    };

    const render = (p: number) => {
      // the second line follows the first by a beat
      el.style.setProperty("--a", easeInOut(clamp(p / 0.88)).toFixed(4));
      el.style.setProperty("--b", easeInOut(clamp((p - 0.12) / 0.88)).toFixed(4));
    };

    const tick = () => {
      const t = target();
      current += (t - current) * SMOOTH;
      if (Math.abs(t - current) < 0.0005) current = t;
      render(current);
      frame = current === t ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    current = target();
    render(current);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, []);

  return (
    <h2 ref={ref} className="story__title" id="story-title">
      <span className="story__line-1">{line1}</span>
      <span className="story__line-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={line2Image} alt={line2Alt} width={1081} height={144} />
      </span>
    </h2>
  );
}
