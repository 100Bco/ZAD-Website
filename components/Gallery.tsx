"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Slide = { image: string; alt: string };

/** Auto-playing photo slider. Clicking the photo pauses it on the current image; clicking again resumes. */
export default function Gallery({ slides, label }: { slides: Slide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length, tick, paused]);

  return (
    <section className={`container gallery${paused ? " is-paused" : ""}`} aria-label={label}>
      <div className="gallery__frame">
        <button
          type="button"
          className="gallery__toggle"
          aria-pressed={paused}
          aria-label={paused ? "Tiếp tục chạy ảnh" : "Dừng ở ảnh này"}
          onClick={() => setPaused((p) => !p)}
        >
          {slides.map((s, i) => (
            <Image
              key={s.image}
              className={`gallery__slide${i === index ? " is-active" : ""}`}
              src={s.image}
              alt={s.alt}
              fill
              sizes="(max-width: 1440px) 92vw, 1320px"
              priority={i === 0}
            />
          ))}
          <span className="gallery__state" aria-hidden="true">
            {paused ? (
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 1.5v9l7.5-4.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
              </svg>
            )}
          </span>
        </button>
        {slides.length > 1 && (
          <div className="gallery__dots">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Ảnh ${i + 1}`}
                aria-current={i === index}
                onClick={() => {
                  go(i);
                  setTick((n) => n + 1);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
