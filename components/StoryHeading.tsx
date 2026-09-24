"use client";

import { useEffect, useRef, useState } from "react";

type Props = { line1: string; line2Image: string; line2Alt: string };

/**
 * "Câu chuyện" slides in from the left and "Chúng tôi viết" from the right.
 * The animation starts once the heading is well inside the screen and always plays through
 * (about 3s in total, see .story__title in globals.css).
 */
export default function StoryHeading({ line1, line2Image, line2Alt }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // wait until the heading is past the bottom 15% of the screen
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} className={`story__title${shown ? " is-visible" : ""}`} id="story-title">
      <span className="story__line-1">{line1}</span>
      <span className="story__line-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={line2Image} alt={line2Alt} width={1081} height={144} />
      </span>
    </h2>
  );
}
