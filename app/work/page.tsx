import type { Metadata } from "next";
import WorkBrowser from "@/components/WorkBrowser";
import Footer from "@/components/Footer";
import { categories, pages, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Các dự án thương hiệu ZAD Agency đã thực hiện, từ nhận diện thương hiệu, bao bì và ấn phẩm in, website và ứng dụng đến chiến dịch quảng cáo.",
};

export default function WorkPage() {
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
