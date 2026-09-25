import type { Metadata } from "next";
import Image from "next/image";
import { pages, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Kết nối với ZAD Agency: ${site.email}, ${site.phone}.`,
};

export default function ContactPage() {
  const c = pages.contact;
  return (
    <>
      <main id="main" className="page">
        <section className="container split" aria-labelledby="contact-title">
          <h1 className="contact-intro__title reveal" id="contact-title">
            {c.title}
          </h1>
          <p className="contact-intro__text reveal" style={{ ["--delay" as string]: ".1s" }}>
            {c.text}
          </p>
        </section>

        <hr className="rule" />

        <section className="container split contact-info" aria-label="Thông tin liên hệ">
          <div>
            <p className="contact-info__big">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </p>
            <a className="contact-info__cta" href={`mailto:${site.email}`}>
              {c.cta}
            </a>
          </div>
          <address className="contact-info__office">
            <b>{site.office.label}</b>
            <br />
            {site.office.address}
          </address>
        </section>

        <div className="contact-photo">
          <div className="container contact-photo__frame">
            <Image
              src={c.photo}
              alt={c.photoAlt}
              fill
              sizes="(max-width: 1440px) 92vw, 1320px"
              priority
              style={{ objectPosition: c.photoFocus ?? "50% 50%" }}
            />
          </div>
        </div>
      </main>

      <footer className="contact-footer">
        <div className="container">
          <p className="contact-footer__copy">{site.copyright}</p>
          <p className="contact-footer__social">
            {site.socials.map((s, i) => (
              <span key={s.label}>
                {i > 0 && "/ "}
                <a href={s.href} target="_blank" rel="noopener">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </footer>
    </>
  );
}
