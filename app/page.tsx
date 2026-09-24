import Link from "next/link";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import ServicesAccordion from "@/components/ServicesAccordion";
import WorkGrid from "@/components/WorkGrid";
import PlusZoom from "@/components/PlusZoom";
import StoryHeading from "@/components/StoryHeading";
import Footer from "@/components/Footer";
import { featuredProjects, home } from "@/lib/content";

export default function HomePage() {
  const { hero, services, story, clients } = home;

  return (
    <>
      <Intro />
      <main id="main">
        <Hero
          line1={hero.line1}
          line2={hero.line2}
          video={hero.video}
          showreel={hero.showreel}
          showreelAfter={hero.showreelAfter}
        />

        <section className="services" id="services" aria-labelledby="services-label">
          <div className="container services__grid">
            <p className="label services__label" id="services-label">
              {services.label}
            </p>
            <h2 className="services__intro reveal reveal--slow">
              {services.intro[0]}
              <br /> {services.intro[1]}
            </h2>
            <ServicesAccordion items={services.items} video={services.video} reel={services.reel} />
          </div>
        </section>

        <section className="story" aria-labelledby="story-title">
          <div className="container">
            <StoryHeading line1={story.line1} line2Image={story.line2Image} line2Alt={story.line2Alt} />

            <div className="section-head">
              <p className="label">{story.featuredLabel}</p>
              <Link className="pill pill--blue" href="/work">
                {story.viewAll}
              </Link>
            </div>

            <WorkGrid projects={featuredProjects} animation="reveal" />

          </div>
        </section>

        <PlusZoom />

        <section className="clients" aria-labelledby="clients-label">
          <div className="container">
            <p className="label" id="clients-label">
              {clients.label}
            </p>
            <div className="clients__logos reveal">
              <Clients items={clients.items} />
            </div>
          </div>
        </section>
      </main>
      <Footer light />
    </>
  );
}
