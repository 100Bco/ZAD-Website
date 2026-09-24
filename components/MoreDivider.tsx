"use client";

import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = {
  label: string;
  icon: "plus" | "down";
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
  className?: string;
};

const ICONS: Record<Props["icon"], ReactNode> = {
  plus: (
    <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
      <path d="M3.37 7.6V4.6H.3V3.4h3.07V.2h1.26v3.2H7.7v1.2H4.63v3H3.37Z" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 8 10" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 .5v8M.8 5.6 4 8.8l3.2-3.2" />
    </svg>
  ),
};

/**
 * Divider line with a round badge in the middle. The line draws out from the badge when it
 * scrolls into view, and the badge is pulled towards the pointer (magnetic button).
 */
export default function MoreDivider({ label, icon, href, onClick, expanded, className }: Props) {
  const badge = useRef<HTMLSpanElement>(null);

  const pull = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !badge.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const x = Math.max(-80, Math.min(80, dx * 0.35));
    const y = Math.max(-14, Math.min(14, dy * 0.35));
    badge.current.style.setProperty("--mx", `${x}px`);
    badge.current.style.setProperty("--my", `${y}px`);
  };
  const release = () => {
    badge.current?.style.setProperty("--mx", "0px");
    badge.current?.style.setProperty("--my", "0px");
  };

  const inner = (
    <span ref={badge} className="divider__badge">
      {ICONS[icon]}
    </span>
  );
  const cls = `divider divider--${icon}${expanded ? " is-expanded" : ""} ${className ?? ""}`;
  const common = { className: cls, "aria-label": label, onPointerMove: pull, onPointerLeave: release, "data-observe": "" };

  if (href) {
    return (
      <Link href={href} {...common}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-expanded={expanded} {...common}>
      {inner}
    </button>
  );
}
