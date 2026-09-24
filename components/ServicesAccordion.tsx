"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Service = { number: string; title: string; description: string; image: string };

type Props = {
  items: Service[];
  /** Video that plays while no service is selected. */
  video?: string;
  /** Used when there is no video yet: project images shown in random order. */
  reel: string[];
};

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ServicesAccordion({ items, video, reel }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [order, setOrder] = useState(reel);
  const [frame, setFrame] = useState(0);
  const selected = hover ?? open;

  // Random "video" reel while nothing is selected
  useEffect(() => {
    setOrder(shuffle(reel));
  }, [reel]);

  useEffect(() => {
    if (video || selected !== null || order.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % order.length), 1800);
    return () => clearInterval(t);
  }, [video, selected, order.length]);

  return (
    <>
      <div className={`services__media${selected === null ? " is-reel" : ""}`} aria-hidden="true">
        {video ? (
          <video className="services__video" src={video} autoPlay muted loop playsInline />
        ) : (
          order.map((src, i) => (
            <Image
              key={src}
              className={`services__frame${selected === null && i === frame ? " is-active" : ""}`}
              src={src}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 20vw"
              priority={i === 0}
            />
          ))
        )}
        {items.map((s, i) => (
          <Image
            key={s.number}
            className={`services__thumb${i === selected ? " is-active" : ""}`}
            src={s.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 20vw"
          />
        ))}
      </div>

      <div className="accordion" onPointerLeave={() => setHover(null)}>
        {items.map((s, i) => {
          const isOpen = i === open;
          return (
            <div
              key={s.number}
              className={`accordion__item${isOpen ? " is-open" : ""}${i === selected ? " is-selected" : ""}`}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setHover(i);
              }}
            >
              <button
                className="accordion__head"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`svc-${s.number}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="accordion__num">{s.number}</span>
                <span className="accordion__title">
                  {s.title} <span className="accordion__icon" aria-hidden="true" />
                </span>
              </button>
              <div className="accordion__panel" id={`svc-${s.number}`} role="region">
                <div>
                  <p>{s.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
