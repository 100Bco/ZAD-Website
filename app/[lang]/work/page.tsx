import type { Metadata } from "next";
import WorkBrowser from "@/components/WorkBrowser";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import { alternates, localeFromParams } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return { title: "Work", description: getContent(locale).ui.meta.work, alternates: alternates(locale, "/work") };
}

export default async function WorkPage({ params }: Props) {
  const { pages, categories, projects } = getContent(await localeFromParams(params));
  return (
    <>
      <main id="main" className="page">
        <section className="container" aria-labelledby="work-title">
          <p className="label">{pages.work.label}</p>
          <h1 className="work-intro__title reveal" id="work-title">
            {pages.work.title}
          </h1>
          <WorkBrowser categories={categories} projects={projects} emptyText={pages.work.empty} />
        </section>
      </main>
      <Footer />
    </>
  );
}
