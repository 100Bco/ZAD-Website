"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useLocale } from "@/components/LocaleProvider";

export default function NotFound() {
  const { ui, href } = useLocale();
  return (
    <>
      <main id="main" className="page">
        <section className="container" style={{ minHeight: "40vh" }}>
          <p className="label">404</p>
          <h1 className="work-intro__title">{ui.notFound.title}</h1>
          <p style={{ marginTop: 24 }}>
            <Link className="pill pill--blue" href={href("/")}>
              {ui.notFound.home}
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
