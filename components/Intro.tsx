"use client";

import { useEffect, useRef, useState } from "react";
import { LogoPaths } from "./Logo";

const KEY = "zad-intro";
const MIN_DURATION = 1900;

/** Blue loading screen from the Figma "Intro Loading" frame. Shown once per browser session. */
export default function Intro() {
  const [state, setState] = useState<"showing" | "leaving" | "done">("showing");
  const finished = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      root.classList.remove("is-intro-pending");
      setState("done");
      return;
    }

    document.body.classList.add("is-locked");
    const start = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      root.classList.remove("is-intro-pending");
      document.body.classList.remove("is-locked");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setState("leaving");
      timer = setTimeout(() => setState("done"), 1200);
    };

    const ready = () => {
      timer = setTimeout(finish, Math.max(0, MIN_DURATION - (Date.now() - start)));
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    const skip = () => finish();
    window.addEventListener("zad-intro-skip", skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", ready);
      window.removeEventListener("zad-intro-skip", skip);
      document.body.classList.remove("is-locked");
    };
  }, []);

  if (state === "done") return null;

  return (
    <div
      className={`intro${state === "leaving" ? " is-leaving" : ""}`}
      aria-hidden="true"
      onClick={() => window.dispatchEvent(new Event("zad-intro-skip"))}
    >
      <div className="intro__stage">
        <span className="intro__ring intro__ring--2" />
        <span className="intro__ring intro__ring--1" />
        <span className="intro__disc" />
        <span className="intro__logo">
          <svg viewBox="0 0 72 24" fill="currentColor">
            <LogoPaths />
          </svg>
        </span>
      </div>
    </div>
  );
}
