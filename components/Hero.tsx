"use client";

import { useEffect, useRef, useState } from "react";

type Segment = { text: string; tone?: string };

export type HeroVideo = {
  /** Wistia media id the files come from (for reference when the video is replaced). */
  wistiaId?: string;
  /** 1080p mp4, played on tablets and computers. Phones draw the ripple in CSS instead. */
  mp4: string;
  /** Frame shown while the video loads */
  poster?: string;
};

type Props = {
  line1: Segment[];
  line2: Segment[];
  /** Full-screen looping background video. Empty = the ring artwork from Figma. */
  video?: HeroVideo | null;
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
  // The 16:9 video only suits wider screens; phones get the portrait ripple drawn in CSS
  // (.hero__pool) and never download the video.
  const [wide, setWide] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Respect "reduce motion": keep the poster frame instead of playing the video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.muted = true;
    v.play().catch(() => {});
  }, [wide]);

  useEffect(() => {
    if (!showreel) return;
    const t = setTimeout(() => setReel(true), showreelAfter * 1000);
    return () => clearTimeout(t);
  }, [showreel, showreelAfter]);

  return (
    <section className={`hero${reel ? " is-reel" : ""}`} aria-label="Giới thiệu">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__pool" aria-hidden="true">
        <i className="hero__wave" />
        <i className="hero__disc" />
      </div>
      {video?.mp4 && wide && (
        <video
          ref={videoRef}
          className="hero__video"
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
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
