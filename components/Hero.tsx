"use client";

import { useEffect, useState } from "react";

type Segment = { text: string; tone?: string };

type Props = {
  line1: Segment[];
  line2: Segment[];
  /** Looping background video. Empty = the ring artwork from Figma. */
  video?: string;
  /** Project showreel that replaces the headline after `showreelAfter` seconds. Empty = headline stays. */
  showreel?: string;
  showreelAfter?: number;
};

function Line({ parts, delay }: { parts: Segment[]; delay: string }) {
  return (
    <span className="hero__line">
      <span style={{ ["--delay" as string]: delay }}>
        {parts.map((p, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className={`hero__seg${p.tone ? ` hero__seg--${p.tone}` : ""}`}>{p.text}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero({ line1, line2, video, showreel, showreelAfter = 10 }: Props) {
  const [reel, setReel] = useState(false);

  useEffect(() => {
    if (!showreel) return;
    const t = setTimeout(() => setReel(true), showreelAfter * 1000);
    return () => clearTimeout(t);
  }, [showreel, showreelAfter]);

  return (
    <section className={`hero${reel ? " is-reel" : ""}`} aria-label="Giới thiệu">
      <div className="hero__bg" aria-hidden="true" />
      {video && <video className="hero__video" src={video} autoPlay muted loop playsInline aria-hidden="true" />}
      <h1 className="hero__title">
        <Line parts={line1} delay=".25s" />
        <Line parts={line2} delay=".4s" />
      </h1>
      {showreel && (
        <video className="hero__reel" src={showreel} autoPlay={reel} muted loop playsInline preload="none" aria-hidden="true" />
      )}
    </section>
  );
}
