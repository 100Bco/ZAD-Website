"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent } from "react";
import type { Project } from "@/lib/content";
import type { CardVariant } from "@/lib/workLayout";

const SIZES: Record<CardVariant, string> = {
  small: "(max-width: 767px) 100vw, 28vw",
  wide: "(max-width: 767px) 100vw, 57vw",
  tall: "(max-width: 767px) 100vw, 34vw",
  banner: "(max-width: 767px) 100vw, 34vw",
  square: "(max-width: 767px) 100vw, 34vw",
  landscape: "(max-width: 767px) 100vw, 57vw",
  full: "92vw",
};

type Props = {
  project: Project;
  variant: CardVariant;
  className?: string;
  style?: CSSProperties;
};

/** Project thumbnail with the "View project" bubble that follows the pointer. Click opens the lightbox. */
export default function WorkCard({ project, variant, className, style }: Props) {
  const track = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <figure className={`card card--${variant} ${className ?? ""}`} style={style}>
      <a
        className="card__media"
        href={project.image}
        data-title={project.title}
        onPointerEnter={track}
        onPointerMove={track}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--x", `${el.clientWidth / 2}px`);
          el.style.setProperty("--y", `${el.clientHeight / 2}px`);
        }}
      >
        <Image src={project.image} alt={project.title} fill sizes={SIZES[variant]} />
        <span className="card__view">View project</span>
      </a>
      <figcaption className="card__caption">{project.title}</figcaption>
    </figure>
  );
}
