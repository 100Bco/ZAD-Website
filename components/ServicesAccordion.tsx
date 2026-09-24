"use client";

import Image from "next/image";
import { useState } from "react";

type Service = { number: string; title: string; description: string; image: string };

export default function ServicesAccordion({ items }: { items: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="services__media" aria-hidden="true">
        {items.map((s, i) => (
          <Image
            key={s.number}
            className={i === active ? "is-active" : undefined}
            src={s.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 20vw"
            priority={i === 0}
          />
        ))}
      </div>

      <div className="accordion">
        {items.map((s, i) => {
          const open = i === active;
          return (
            <div key={s.number} className={`accordion__item${open ? " is-open" : ""}`}>
              <button
                className="accordion__head"
                type="button"
                aria-expanded={open}
                aria-controls={`svc-${s.number}`}
                onClick={() => setActive(i)}
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
