import Image from "next/image";
import Link from "next/link";
import Intro from "@/components/Intro";
import ServicesAccordion from "@/components/ServicesAccordion";
import WorkGrid from "@/components/WorkGrid";
import Divider from "@/components/Divider";
import Footer from "@/components/Footer";
import { featuredProjects, home } from "@/lib/content";

type Segment = { text: string; tone?: string };

function HeroLine({ parts, delay }: { parts: Segment[]; delay: string }) {
  return (
    <span className="hero__line">
      <span style={{ ["--delay" as string]: delay }}>
        {parts.map((p, i) =>
          p.tone ? (
            <strong key={i} className={p.tone === "blue" ? "text-blue" : "text-light-blue"}>
              {p.text}
            </strong>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </span>
    </span>
  );
}

export default function HomePage() {
  const { hero, services, story, clients } = home;

  return (
    <>
      <Intro />
      <main id="main">
        <section className="hero" aria-label="Giới thiệu">
          <div className="hero__bg" aria-hidden="true" />
          <h1 className="hero__title">
            <HeroLine parts={hero.line1} delay=".25s" />
            <HeroLine parts={hero.line2} delay=".4s" />
          </h1>
        </section>

        <section className="services" id="services" aria-labelledby="services-label">
          <div className="container services__grid">
            <p className="label services__label" id="services-label">
              {services.label}
            </p>
            <h2 className="services__intro reveal">
              {services.intro[0]}
              <br /> {services.intro[1]}
            </h2>
            <ServicesAccordion items={services.items} />
          </div>
        </section>

        <section className="story" aria-labelledby="story-title">
          <div className="container">
            <h2 className="story__title reveal" id="story-title">
              <span className="story__line-1">{story.line1}</span>
              <span className="story__line-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.line2Image} alt={story.line2Alt} width={1081} height={144} />
              </span>
            </h2>

            <div className="section-head">
              <p className="label">{story.featuredLabel}</p>
              <Link className="pill pill--blue" href="/work">
                {story.viewAll}
              </Link>
            </div>

            <WorkGrid projects={featuredProjects} animation="reveal" />

            <Divider className="works-more" href="/work" label="Xem thêm dự án" icon="plus" />
          </div>
        </section>

        <section className="clients" aria-labelledby="clients-label">
          <div className="container">
            <p className="label" id="clients-label">
              {clients.label}
            </p>
            <div className="clients__logos reveal">
              <Image
                src={clients.image}
                width={clients.width}
                height={clients.height}
                sizes="(max-width: 767px) 720px, 92vw"
                alt={`Khách hàng: ${clients.names.join(", ")}`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
