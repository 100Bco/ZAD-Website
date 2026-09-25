"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

/** `focus`: which part of the photo stays in the wide frame, as a CSS object-position (e.g. "50% 15%"). */
type Slide = { image: string; alt: string; focus?: string };

const AUTOPLAY_MS = 5000;

/**
 * Photo carousel: slides move sideways; the dots under the photo jump to any slide.
 * It advances on its own until the visitor picks a slide (dot, arrow key or swipe),
 * then stays where they left it. Hovering also holds the current photo.
 */
export default function Gallery({ slides, label }: { slides: Slide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const swipe = useRef<{ x: number; id: number } | null>(null);
  const count = slides.length;

  const goTo = (i: number) => {
    setIndex(((i % count) + count) % count);
    setManual(true);
  };

  useEffect(() => {
    if (manual || hover || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, manual, hover, count]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, id: e.pointerId };
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      className="container gallery"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
      }}
    >
      <div
        className="gallery__frame"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <div className="gallery__track" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
          {slides.map((s, i) => (
            <div
              key={s.image}
              className="gallery__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 767px) 92vw, 1000px"
                priority={i === 0}
                draggable={false}
                style={{ objectPosition: s.focus ?? "50% 50%" }}
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <div className="gallery__dots">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
