"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Slide = { image: string; alt: string };

export default function Gallery({ slides, label }: { slides: Slide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length, tick]);

  return (
    <section className="container gallery" aria-label={label}>
      <div className="gallery__frame">
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
