"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Item = { src: string; title: string };

/** Opens any `.card__media` link on the page in a full-screen viewer. */
export default function Lightbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(-1);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index >= 0;

  const close = useCallback(() => {
    setIndex(-1);
    lastFocus.current?.focus();
  }, []);

  const step = useCallback(
    (dir: number) => setIndex((i) => (items.length ? (i + dir + items.length) % items.length : -1)),
    [items.length]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(".card__media");
      if (!link || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".card__media"));
      setItems(links.map((a) => ({ src: a.getAttribute("href") ?? "", title: a.dataset.title ?? "" })));
      lastFocus.current = link;
      setIndex(links.indexOf(link));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const item = open ? items[index] : undefined;

  return (
    <div
      className={`lightbox${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Xem dự án"
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button ref={closeRef} className="lightbox__close" type="button" aria-label="Đóng" onClick={close}>
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {item && <img className="lightbox__img" src={item.src} alt={item.title} />}
      <div className="lightbox__bar">
        <p className="lightbox__caption">{item?.title}</p>
        <div className="lightbox__nav">
          <button type="button" aria-label="Dự án trước" onClick={() => step(-1)}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>
          <button type="button" aria-label="Dự án sau" onClick={() => step(1)}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
