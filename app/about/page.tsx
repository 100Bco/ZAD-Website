import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import TeamGrid from "@/components/TeamGrid";
import Footer from "@/components/Footer";
import { about, site, team, type RichText } from "@/lib/content";

/** Rings appear one by one from the smallest (left) to the largest, 0.9s apart. */
const RING_STEP = 0.9;

export const metadata: Metadata = {
  title: "About",
  description: "Thương hiệu không có nút UNDO. ZAD xây thương hiệu từ chiến lược, để mỗi đồng đầu tư chỉ cần chi một lần.",
};

function Rich({ parts }: { parts: RichText }) {
  return (
    <>
      {parts.map((p, i) => (p.strong ? <b key={i}>{p.strong}</b> : <span key={i}>{p.text}</span>))}
    </>
  );
}

/** Three circles tangent at the left edge, as drawn in Figma (stage 1440 x 946). */
function ring(cx: number, cy: number, r: number) {
  return `M${(cx - r).toFixed(2)} ${cy}a${r} ${r} 0 1 0 ${(2 * r).toFixed(2)} 0a${r} ${r} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
}

export default function AboutPage() {
  const { intro, gallery, achievements, ecosystem, marquee, steps, recruit } = about;
  const marqueeItem = (
    <>
      <span className="text-blue">{marquee.accent}</span> {marquee.rest}
    </>
  );

  return (
    <>
      <main id="main" className="page">
        <section className="container split" aria-labelledby="about-title">
          <h1 className="label about-intro__label" id="about-title">
            {intro.label[0]}
            <br /> {intro.label[1]}
          </h1>
          <div className="about-intro__text reveal">
            {intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <Gallery slides={gallery} label="Không gian làm việc của ZAD" />

        <section className="achievements" data-observe aria-labelledby="ach-title">
          <div className="achievements__stage">
            <svg
              className="achievements__rings"
              viewBox="0 0 1440 946"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ring-fade" x1="0" y1="326" x2="0" y2="943" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C3E3FC" />
                  <stop offset="0.856" stopColor="#C3E3FC" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g opacity="0.56" stroke="url(#ring-fade)" strokeWidth="3">
                <path className="ring ring--3" d={ring(720.06, 634.55, 656.06)} pathLength={1} />
                <path className="ring ring--2" d={ring(538.66, 634.55, 474.66)} pathLength={1} />
                <path className="ring ring--1" d={ring(369.11, 634.55, 305.11)} pathLength={1} />
              </g>
              <circle className="dot dot--3" cx="1325" cy="379" r="21" fill="#C3E3FC" />
              <circle className="dot dot--2" cx="1008" cy="566" r="13" fill="#C3E3FC" />
              <circle className="dot dot--1" cx="662" cy="722" r="8" fill="#C3E3FC" />
            </svg>

            {achievements.stats.map((s) => (
              <p
                key={s.label}
                className="stat"
                style={{
                  ["--x" as string]: s.x,
                  ["--y" as string]: s.y,
                  ["--delay" as string]: `${(s.ring - 1) * RING_STEP + 0.6}s`,
                }}
              >
                <span
                  className="stat__num"
                  data-count={s.value}
                  data-suffix={s.suffix}
                  data-delay={(s.ring - 1) * RING_STEP + 0.6}
                >
                  {s.value}
                  {s.suffix}
                </span>
                <span className="stat__label">{s.label}</span>
              </p>
            ))}

          </div>

          <div className="container achievements__foot">
            <h2 className="achievements__title" id="ach-title">
              {achievements.title}
            </h2>
            <p className="achievements__note">{achievements.note}</p>
          </div>
        </section>

        <section className="ecosystem" aria-labelledby="eco-title">
          <div className="container ecosystem__grid">
            <div className="ecosystem__intro">
              <p className="label">{ecosystem.label}</p>
              <h2 className="ecosystem__title" id="eco-title">
                <span className="text-blue ecosystem__accent">{ecosystem.titleAccent}</span>
                {ecosystem.title}
              </h2>
            </div>
            {ecosystem.cards.map((c, i) => (
              <article
                key={c.name}
                className="eco-card reveal"
                style={{ ["--delay" as string]: `${i * 0.15}s` }}
              >
                <span className="eco-card__num">{i + 1}</span>
                {c.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="eco-card__logo" src={c.logo} alt={c.name} />
                )}
                <div className="eco-card__body">
                  <h3>{c.name}</h3>
                  <p>
                    <Rich parts={c.body} />
                  </p>
                  {c.bullets && (
                    <ul>
                      {c.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="run" aria-label={`${marquee.accent} ${marquee.rest}`}>
          <div className="marquee" aria-hidden="true">
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className="marquee__item">
                {marqueeItem}
              </span>
            ))}
          </div>
          <div className="steps">
            <ol className="container steps__list">
              {steps.map((s, i) => (
                <li key={s} className="reveal" style={{ ["--delay" as string]: `${i * 0.18}s` }}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="team" id="team" aria-labelledby="team-title">
          <div className="container">
            <p className="label">{about.team.label}</p>
            <h2 className="team__title reveal" id="team-title">
              {about.team.title}
            </h2>
            <TeamGrid
              members={team}
              initialVisible={about.team.initialVisible}
              moreLabel={about.team.moreLabel}
              lessLabel={about.team.lessLabel}
            />
          </div>
        </section>

        <section className="container recruit" id="recruit" aria-label="Tuyển dụng">
          <p className="recruit__text reveal">
            {recruit.text[0]}
            <br /> {recruit.text[1]}
          </p>
          <a className="recruit__cta" href={`mailto:${site.email}?subject=${encodeURIComponent(recruit.subject)}`}>
            {recruit.cta[0]}
            <br /> {recruit.cta[1]}
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
